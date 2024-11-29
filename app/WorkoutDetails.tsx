import { View, Text, StyleSheet, Button, Alert, Pressable, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import InternalWorkoutBuddiesList from './components/InternalWorkoutBuddiesList'
import { ScrollView } from 'react-native';
import React, {useEffect, useState} from 'react';
import { allWorkoutInvitations, allWorkoutParticipants, participantWorkoutInfo, useUpdateParticipantStatus } from './api/workouts';
import { useAuth } from './providers/AuthProvider';
import { userBuddies } from './api/buddies';
import { useParticipantSubscription, useInvitationsSubscription } from './api/subscriptions';





const WorkoutDetailsScreen = ({route}) => {

  const { session } = useAuth();
    const { workout} = route.params;

    if (!workout) {
      Alert.alert('Workout is undefined!')
      return null;  
    }

    useParticipantSubscription( workout.id )
    useInvitationsSubscription( workout.id )
    const displayDate = workout.workout_date.split('T')[0]
    const [participantState, setParticipantState] = useState('waiting')
    const [canStart, setCanStart] = useState(false)
    const [completed, setCompleted] = useState(false)
    const navigation = useNavigation()
    const [inviteBuddyList, setInviteBuddyList] = useState([])
    const [timeNow, setTimeNow] = useState(new Date());
    const timePlus10Minutes = new Date(workout.start_time);
    timePlus10Minutes.setMinutes(timePlus10Minutes.getMinutes() - 10);

    const { data: participationInfo, isLoading: isParticipationLoading, error: participationError } = participantWorkoutInfo(session?.user.id, workout.id);
    //const { data: BuddiesInfo, isLoading: isBuddiesLoading, error: BuddiesError } = workoutBuddies(session?.user.id, workout.id);
    const { data: allParticipants, isLoading: allParticipantsLoading, error: allParticipantsError } = allWorkoutParticipants(workout.id);
    const { data: allInvitations, isLoading: allInvitationsLoading, error: allInvitationsError } = allWorkoutInvitations(workout.id);



    const {data: UserBuddies, isLoading : isLoadingUserBuddies} = userBuddies(session?.user.id);

    const {mutate: updateParticipantStatus} = useUpdateParticipantStatus();

    const onStart = () => {
      updateParticipantStatus({user_id : session?.user.id, workout_id : workout.id, status : 'in workout'},
        {
          onSuccess: () => {
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


    const onCheckIn = () => {
      
      if(participantState == 'checked in')
      {
        
        updateParticipantStatus({user_id : session?.user.id, workout_id : workout.id, status : 'waiting', duration : '0', activity : 'N/A'})
      
      }
      if(participantState == 'waiting')
      {
        updateParticipantStatus({user_id : session?.user.id, workout_id : workout.id, status : 'checked in', duration : '0', activity : 'N/A'})
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


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style ={styles.staticInfo}>
        <Text style= {styles.text}>Title: {workout.title}</Text>
        <Text style= {styles.text}>Date: {displayDate}</Text>
        <Text style= {styles.text}>Start: {formatTime(workout.start_time)}</Text>
        <Text style= {styles.text}>End: {formatTime(workout.end_time)}</Text>
        { participantState == 'complete' &&
          <Text style= {styles.text}>Activity: {participationInfo.activity}</Text>
        }
        { participantState == 'complete' &&
          <Text style= {styles.text}>Duration: {participationInfo.duration}</Text>
        }
        <Text style= {styles.text}>Notes: </Text>
        <Text style= {styles.text}>{workout.notes}</Text>

      </View>

      <InternalWorkoutBuddiesList 
        buddies={UserBuddies} 
        forNew={false} 
        OnAddBuddyToInvites={handleBuddyInviteList} 
        allParticipants={allParticipants} 
        allInvitations={allInvitations} 
        workout= {workout} 
        participantState={participantState}/>

      <View style={styles.buttonContainer}>
      {!completed && participantState != 'in workout' && workout.workout_status != 'past' && timeNow <= timePlus10Minutes &&
        
        <TouchableOpacity onPress= {onCheckIn} style={styles.button}>
            <Text>{ canStart ? 'Leave' : 'Check In'}</Text>
        </TouchableOpacity>
       


      }
        
        { canStart && !completed && 

          <TouchableOpacity onPress={onStart}  style={styles.button}>
              <Text style={styles.buttonText}>{participantState == 'in workout' ? 'Resume' : 'Start!'} </Text>
          </TouchableOpacity>
        }
        </View>

      </ScrollView>
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

  text: {
    color: 'black',
    fontSize: 20,
  },

  button: {
    width: 100,
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


});

export default WorkoutDetailsScreen;