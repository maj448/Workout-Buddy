import { View, Text, StyleSheet, Button, Alert, Pressable } from 'react-native';
import { format, parseISO} from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import WorkoutBuddiesList from './WorkoutBuddiesList'
import { ScrollView } from "react-native-web";
import React, {useEffect, useState} from 'react';
import { participantWorkoutInfo, useUpdateParticipantStatus } from './api/workouts';
import { useAuth } from './providers/AuthProvider';
import { workoutBuddies } from './api/buddies';

const WorkoutDetailsScreen = ({route}) => {
  const { session } = useAuth();
    const { workout} = route.params;

    if (!workout) {
      Alert.alert('Workout is undefined!')
      return null;  
    }
    //console.log(workout)

    const displayStartTime = format(parseISO(workout.start_time), 'h:mm a')
    const displayEndTime = format(parseISO(workout.end_time), 'h:mm a')
    const displayDate = format(parseISO(workout.workout_date), 'yyyy-mm-dd')
    const [newWorkout, setNewWorkout] = useState('')
    const [participantState, setParticipantState] = useState('waiting')
    const [canStart, setCanStart] = useState(false)
    const [completed, setCompleted] = useState(false)
    const navigation = useNavigation()

    const { data: participationInfo, isLoading: isParticipationLoading, error: participationError } = participantWorkoutInfo(session?.user.id, workout.id)
    const { data: BuddiesInfo, isLoading: isBuddiesLoading, error: BuddiesError } = workoutBuddies(session?.user.id, workout.id)

    const {mutate: updateParticipantStatus} = useUpdateParticipantStatus();
    console.log(participationInfo)
    //console.log(BuddiesInfo)
    const onStart = () => {
      updateParticipantStatus({user_id : session?.user.id, workout_id : workout.id, status : 'complete'})
      navigation.navigate('In Workout')
    }

    console.log('og state', participantState)
    const onCheckIn = () => {
      
      if(participantState == 'checkedIn')
      {
        
        updateParticipantStatus({user_id : session?.user.id, workout_id : workout.id, status : 'waiting'})
        console.log('after c ', participantState)
      
      }
      if(participantState == 'waiting')
      {
        updateParticipantStatus({user_id : session?.user.id, workout_id : workout.id, status : 'checkedIn'})
        console.log('after w ', participantState)
      }

    }

    useEffect(() => {
      if (participationInfo)
        setParticipantState(participationInfo.status)
      if(participantState == 'checkedIn')
      {
        setCanStart(true)
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

    <View style={styles.container}>
      <View style ={styles.staticInfo}>
        <Text style= {styles.text}>Title: {workout.title}</Text>
        <Text style= {styles.text}>Date: {displayDate}</Text>
        <Text style= {styles.text}>Start: {displayStartTime}</Text>
        <Text style= {styles.text}>End: {displayEndTime}</Text>
        { participantState == 'complete' &&
          <Text style= {styles.text}>Activity: {participationInfo.activity}</Text>
          // <Text style= {styles.text}>Duration: {workout.duration}</Text>
        }
        { participantState == 'complete' &&
          //<Text style= {styles.text}>Activity: {workout.activity}</Text>
          <Text style= {styles.text}>Duration: {participationInfo.duration}</Text>
        }
        <Text style= {styles.text}>Notes: {workout.notes}</Text>

      </View>

      <WorkoutBuddiesList/>

      <View style={styles.buttonContainer}>
      {!completed &&
        
          <Pressable onPress= {onCheckIn} style={styles.button}>
              <Text>{ canStart ? 'Leave' : 'Check In'}</Text>
          </Pressable>
       


      }
        
        { canStart && !completed &&

            <Pressable onPress={onStart}  style={styles.button}>
                <Text style={styles.buttonText}>Start!</Text>
            </Pressable>
        }
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#6EEB92',
    padding: 10, 
    gap: 10, 
  },
  staticInfo: {
    flex: 2,
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
    flex:1, 
    alignItems: 'center',
    justifyContent: 'flex-start',
  }

});

export default WorkoutDetailsScreen;