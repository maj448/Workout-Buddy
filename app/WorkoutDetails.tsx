import { View, Text, StyleSheet, Button, Alert, Pressable, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import InternalWorkoutBuddiesList from './components/InternalWorkoutBuddiesList'
import { ScrollView } from 'react-native';
import React, {useEffect, useState} from 'react';
import { allWorkoutInvitations, allWorkoutParticipants, participantWorkoutInfo, useUpdateParticipantStatus } from './api/workouts';
import { useAuth } from './providers/AuthProvider';
import { userBuddies } from './api/buddies';
import { useParticipantSubscription, useInvitationsSubscription } from './api/subscriptions';
import { useQueryClient } from '@tanstack/react-query';
import {  Gesture, GestureDetector, Directions} from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';





const WorkoutDetailsScreen = ({route}) => {

  const { session } = useAuth();
    const { user_id, workout} = route.params;
    const queryClient = useQueryClient();

    if (!workout) {
      Alert.alert('Workout is undefined!')
      return null;  
    }

    useParticipantSubscription( workout.id )
    useInvitationsSubscription( workout.id )

    const displayDate = workout.workout_date.split('T')[0]
    const [participantState, setParticipantState] = useState('')
    const [canStart, setCanStart] = useState(false)
    const [completed, setCompleted] = useState(false)
    const navigation = useNavigation()
    const [inviteBuddyList, setInviteBuddyList] = useState([])
    const [timeNow, setTimeNow] = useState(new Date());
    const [loading, setLoading] = useState(false)
    const [loadingStart, setLoadingStart] = useState(false)
  

    const { data: participationInfo,  error: participationError } = participantWorkoutInfo(user_id, workout.id);
    const { data: allParticipants,  error: allParticipantsError } = allWorkoutParticipants(workout.id);
    const { data: allInvitations, error: allInvitationsError } = allWorkoutInvitations(workout.id);
    const {data: UserBuddies} = userBuddies(user_id);

    const {mutate: updateParticipantStatus} = useUpdateParticipantStatus();

    
    const refresh = () => {

      queryClient.invalidateQueries(['participants', workout.id])
      queryClient.invalidateQueries(['invitations', workout.id])

    }
    const flingGestureDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onEnd(refresh)
    .runOnJS(true)
    ;



    const isParticipant = allParticipants?.filter((participant) => {
      if(session?.user.id == participant.profiles.id )
      return participant})
    

    const onStart = () => {
      setLoadingStart(true)
      updateParticipantStatus({user_id : session?.user.id, workout_id : workout.id, status : 'in workout'},
        {
          onSuccess: () => {
            setLoadingStart(false)
            navigation.navigate('In Workout', {user_id : session?.user.id, workout_id : workout.id});
          },
        }
      )
      
    }

    const formatTime = (date) => {

      date = `${date}Z`
      date = new Date(date);
      return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true});


    };

    const formatDate = (date) => {

      date = `${date}Z`
      date = new Date(date);
      date = new Date(date.getTime() - 10 * 60 * 1000); 
      return date.toISOString();


    };


    const onCheckIn = () => {

      setLoading(true)
      
      if(participantState == 'checked in')
      {
        
        updateParticipantStatus({user_id : session?.user.id, workout_id : workout.id, status : 'waiting', duration : '0', activity : 'N/A'},{
          onSuccess: () => {
            setLoading(false);
          },
          onError: (error) => {
            setLoading(false);
          },
        })
      
      }
      if(participantState == 'waiting')
      {
        updateParticipantStatus({user_id : session?.user.id, workout_id : workout.id, status : 'checked in', duration : '0', activity : 'N/A'},{
          onSuccess: () => {
            setLoading(false);
          },
          onError: (error) => {
            setLoading(false);
          },
        })
      }

    }

    const handleBuddyInviteList = (buddy) => {
      setInviteBuddyList(buddy)
      
  };

    useEffect(() => {
      if (participationInfo)
        setParticipantState(participationInfo.status)
      if(participantState == 'checked in')
      {
        setCanStart(true)
      }
      else if (participantState == 'in workout'){
        setCanStart(true)
        setCompleted(false)
      }
      else if (participantState == 'complete'){
        setCanStart(false)
        setCompleted(true)
      }
      else{
        setCanStart(false)
        setCompleted(false)
      }
          

  }, [participantState, participationInfo ]);

  let buddyparticipants = []
  if(allParticipants){
    buddyparticipants = allParticipants.filter((participant) => {
    if(user_id != participant.profiles.id )
    return participant});}

  return (
    <GestureDetector gesture={flingGestureDown}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style ={styles.staticInfo}>
        <Text style= {styles.title}>{workout.title}</Text>
        <Text style= {styles.text}>Date: {displayDate}</Text>
        <View style={styles.timeContainer}>
          <Text style= {styles.text}>Time : {formatTime(workout.start_time)}</Text>
          <Text style= {styles.text}> to {formatTime(workout.end_time)}</Text>
        </View>
        { participantState == 'complete' &&
          <Text style= {styles.textCompleted}>Completed duration: {participationInfo.duration}</Text>
        }
        { participantState == 'complete' &&
          <Text style= {styles.textCompleted}>Activity: {participationInfo.activity}</Text>
        }

        
        <View style= {styles.noteArea}>
        <Text style= {styles.text}>Notes: </Text>
          <Text style= {styles.text}>{workout.notes ? workout.notes : 'N/A' }</Text>
        </View>

      </View>

      <InternalWorkoutBuddiesList 
        buddies={UserBuddies} 
        forNew={false} 
        OnAddBuddyToInvites={handleBuddyInviteList} 
        allParticipants={buddyparticipants} 
        allInvitations={allInvitations} 
        workout= {workout} 
        participantState={participantState}/>

      <View style={styles.buttonContainer}>
      {!completed && isParticipant?.length > 0 && participantState != 'in workout' && workout.workout_status != 'past' && timeNow.toISOString() >= formatDate(workout.start_time) &&
        
        <TouchableOpacity onPress= {onCheckIn} style={styles.button}>
            <Text>{ canStart ? (!loading ? 'Leave' : 'Leaving...') : (!loading ? 'Check In' : 'Checking in...')}</Text>
        </TouchableOpacity>
       


      }
        
        { canStart && !completed && isParticipant &&

          <TouchableOpacity onPress={onStart}  style={styles.startButton}>
              <Text style={styles.startButtonText}>{participantState == 'in workout' ? (!loadingStart ? 'Resume' : 'Resuming...')  : (!loadingStart ? 'Start!' : 'Starting...')} </Text>
          </TouchableOpacity>
        }
        </View>

      </ScrollView>
      </GestureDetector>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#6EEB92', 
    gap: 10, 
  },

  container: {
    backgroundColor: '#6EEB92',
    padding: 10, 
    gap: 10, 
  },

  staticInfo: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  title: {
    color: 'black',
    fontSize: 30,
    fontWeight : 'bold', 
    paddingBottom: 15
  },

  text: {
    color: 'black',
    fontSize: 22,
  },

  textCompleted: {
    color: 'black',
    fontSize: 22,
    fontWeight: '600'
  },

  timeContainer : {
    flexDirection: 'row',
  },

  noteArea : {
    backgroundColor: '#DDF8D3',
    borderRadius: 10,
    width: '100%', 
    padding: 10, 
    marginTop: 5

  },

  button: {
    width: 150,
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 10,

  },

  buttonText : {
    fontSize: 16,
    color: '#3D3D3D',
    fontFamily: 'fantasy'
  },

  buttonContainer : { 
    alignItems: 'center',
    justifyContent: 'flex-start',
  }, 

  startButton: {
    width: '100%',
    height: 70,
    borderColor: 'gray',
    borderWidth: 2,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 10,

  },

  startButtonText : {
    fontSize: 20,
    color: '#3D3D3D',
    fontWeight: 'bold',
    fontFamily: 'fantasy'
  },

});

export default WorkoutDetailsScreen;