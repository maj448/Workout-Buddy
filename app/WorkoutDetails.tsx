import { View, Text, StyleSheet, Button, Alert, Pressable } from 'react-native';
import { format, parseISO} from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import WorkoutBuddiesList from './WorkoutBuddiesList'
import { ScrollView } from "react-native-web";
import React, {useEffect, useState} from 'react';
import { participantWorkoutInfo } from './api/workouts';
import { useAuth } from './providers/AuthProvider';

const WorkoutDetailsScreen = ({route}) => {
  const { session } = useAuth();
    const { workout} = route.params;

    if (!workout) {
      Alert.alert('Workout is undefined!')
      return null;  
    }
    console.log(workout)

    const displayStartTime = format(parseISO(workout.start_time), 'h:mm a')
    const displayEndTime = format(parseISO(workout.end_time), 'h:mm a')
    const displayDate = format(parseISO(workout.workout_date), 'yyyy-mm-dd')
    const [newWorkout, setNewWorkout] = useState('')
    const [participantState, setParticipantState] = useState('checkedIn')
    const [canStart, setCanStart] = useState(false)
    const [completed, setCompleted] = useState(false)
    const navigation = useNavigation()

    
    const { data: participationInfo, isLoading: isParticipationLoading, error: participationError } = participantWorkoutInfo(session?.user.id, workout.id)


    console.log(participationInfo)
    const onStart = () => {
      //update participant status to complete
      navigation.navigate('In Workout')
    }

    const onCheckIn = () => {
      setCanStart(!canStart)
      if(participantState == 'checkedIn')
      {
        //update participant state to checked in
      }
      if(participantState == 'waiting')
      {
        //update participant status to waiting
      }

    }

    useEffect(() => {
      if (participationInfo)
        setParticipantState(participationInfo.participation_status)
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
          

  }, [participantState]);

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

      {!completed &&
        <Pressable onPress= {onCheckIn}>
            <Text>{ canStart ? 'Leave' : 'Check In'}</Text>
        </Pressable>
      }
        
        { canStart && !completed &&
          <Pressable onPress={onStart}>
              <Text>Start!</Text>
          </Pressable>
        }

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
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  text: {
    color: 'black',
    fontSize: 20,
  },
});

export default WorkoutDetailsScreen;