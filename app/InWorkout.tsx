//this screen is shown when a user has stated a WorkoutBuddiesList
//it has the ability to start, pause and end the workout
//it shows a stopwatch and the buddies also in the workout

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation} from '@react-navigation/native';
import { useUpdateParticipantStatus } from './api/workouts';
import StopwatchContainer from './components/Stopwatch.container';
import InWorkoutBuddiesList from './components/InWorkoutBuddiesList';
import { useAuth } from './providers/AuthProvider';
import { useParticipantUpdateSubscription } from './api/subscriptions';
import { allWorkoutParticipants} from './api/workouts';
import { useStopWatch } from './components/StopWatch';
import { Pedometer } from 'expo-sensors';
import { useState, useEffect} from 'react';
import { PermissionsAndroid } from 'react-native';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import WorkoutBuddiesList from './components/WorkoutBuddiesList'



export default function InWorkout({route}) {
  const navigation = useNavigation();
  const { session } = useAuth();
  const {user_id, workout_id} = route.params;
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [activityAvailable, setActivityAvailable] = useState('N/A');
  const [firstClick, setFirstClick] = useState(true)


  const { data: allParticipants } = allWorkoutParticipants(workout_id);

  useParticipantUpdateSubscription( workout_id )

  const {mutate: updateParticipantStatus} = useUpdateParticipantStatus();

  const {
    start,
    stop,
    end,
    isRunning,
    time,
    dataLoaded,

  } = useStopWatch()

  if (!dataLoaded) {
    return null
  }

  //get the phones pedometer inforamtion to count steps if given permission
  const subscribe = async () => {
    const isAvailable = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION, {
        title: "Request pedometer permission",
        message: "This permissions is required for the pedometer function.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
    })

    if (isAvailable === PermissionsAndroid.RESULTS.GRANTED) {
        return Pedometer.watchStepCount(result => {
            setCurrentStepCount(result.steps);
        });
    } else {
        //alert("Permission denied");
    return;
    }
};



  const handleToggle = () => {
    //reset the step count to 0 on the first start click of a workout
    if(firstClick)
    {
      setCurrentStepCount(0)
    }
    //subscribe to watching the step count
    subscribe();
    isRunning ? stop() : start();



  };


  //update the user status to completed for this workout
  const updateOnComplete = (activity) => {

    updateParticipantStatus({user_id : user_id, workout_id : workout_id, status : 'complete', duration : time , activity : activity},
      {
        onSuccess: () => {
          navigation.goBack();
        },
      }
    )
  }

  //end the workout and update the acivity based on if any steps were counted
  const onEnd = () => {
    end();
    if(currentStepCount > 0)
    {
      updateOnComplete(currentStepCount.toString() + ' steps');
    }
    else{
      updateOnComplete('N/A');
    }
  }

 

  //do not get the current user in the list of all participants
  let buddyparticipants = allParticipants.filter((participant) => {
    if(session?.user.id != participant.profiles.id && participant.status != 'waiting')
    return participant});


 
  return (

    <SafeAreaView style={styles.container}>

      <StopwatchContainer time={time}/>

      <InWorkoutBuddiesList  allParticipants={buddyparticipants}/>

      <View style={styles.sectionStyle}>


          <TouchableOpacity
            style={styles.button}
            onPress={handleToggle}>
            <Text style={styles.buttonText}>
              {!isRunning ? 'Start' : 'Pause'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={onEnd}>
            <Text style={styles.buttonText}>End</Text>
          </TouchableOpacity>
        </View>
        

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },

  sectionStyle: {
    flex: 1,
    backgroundColor: 'darkgray',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row'
  },

  button: {
    width: 100,
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,

  },

  buttonText : {
    fontSize: 16,
    color: '#3D3D3D',
    fontFamily: 'fantasy'
  },

});



