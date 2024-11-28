import React, { useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUpdateParticipantStatus } from './api/workouts';
import StopwatchContainer from './components/Stopwatch.container';
import InWorkoutBuddiesList from './components/InWorkoutBuddiesList';
import { useAuth } from './providers/AuthProvider';
import { useParticipantSubscription } from './api/subscriptions';
import { allWorkoutParticipants} from './api/workouts';
import { useStopWatch } from './components/StopWatch';



export default function InWorkout({route}) {
  const navigation = useNavigation();
  const { session } = useAuth();
  const {user_id, workout_id} = route.params;
  const { data: allParticipants, isLoading: allParticipantsLoading, error: allParticipantsError } = allWorkoutParticipants(workout_id);

  useParticipantSubscription( workout_id )

  const {mutate: updateParticipantStatus} = useUpdateParticipantStatus();
  //const [start, setStart] = useState(false);
  // const [hr, setHr] = useState(0);
  // const [min, setMin] = useState(0);
  // const [sec, setSec] = useState(0);
  // let interval;

  const {
    // actions
    start,
    stop,
    end,
    // data
    isRunning,
    time,
    dataLoaded,

  } = useStopWatch()

  if (!dataLoaded) {
    return null
  }

  const handleToggle = () => {
    isRunning ? stop() : start();
    //setStart((prevStart) => !prevStart);
  };

  // const handleStart = () => {
  //   if (start) {
  //     interval = setInterval(() => {
  //       setSec((prevSec) => {
  //         if (prevSec !== 59) {
  //           return prevSec + 1;
  //         } else if (min !== 59) {
  //           setMin(min + 1);
  //           return 0;
  //         } else {
  //           setHr(hr + 1);
  //           return 0;
  //         }
  //       });
  //     }, 1000);
  //   } else {
  //     clearInterval(interval);
  //   }
  // };

  // const formatTime = () => {
  //   // return `${padToTwo(hr)}:${padToTwo(min)}:${padToTwo(sec)}`;
  //   return time;
  // };

  // const padToTwo = (number) => (number <= 9 ? `0${number}` : number);

  const onEnd = () => {
    end()
    // const formattedDuration = formatTime(); 
    updateParticipantStatus({user_id : user_id, workout_id : workout_id, status : 'complete', duration : time , activity : 'N/A'},
      {
        onSuccess: () => {
          navigation.goBack();
        },
      }
    )
    
  }

  // const returnToDetails = () => {
  //   navigation.goBack()
  // }


  // useEffect(() => {
  //   handleStart();
  //   return () => clearInterval(interval);


  // }, [start]);


  let buddyparticipants = allParticipants.filter((participant) => {
    if(session?.user.id != participant.profiles.id && participant.status != 'waiting')
    return participant});

  return (

    <SafeAreaView style={styles.container}>
      {/* <Pressable onPress={returnToDetails}  style={styles.button}>
        <Text style={styles.buttonText}>Return to Details </Text>
      </Pressable> */}
        <StopwatchContainer 
          // hr={hr} 
          // min={min} 
          // sec={sec} 
          time={time}/>

        <InWorkoutBuddiesList  allParticipants={buddyparticipants}/>


        <View style={styles.sectionStyle}>


          <Pressable
            style={styles.button}
            onPress={handleToggle}>
            <Text style={styles.buttonText}>
              {!isRunning ? 'Start' : 'Pause'}
            </Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={onEnd}>
            <Text style={styles.buttonText}>End</Text>
          </Pressable>
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
    //marginTop: 32,
    backgroundColor: 'darkgray',
    // borderColor: 'black',
    // borderWidth: 2,
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
   // margin: 10,
    borderRadius: 10,

  },
  buttonText : {
    fontSize: 16,
    color: '#3D3D3D',
    fontFamily: 'fantasy'
  },
  // buttonContainer : {
  //   //flex:2, 
  //   alignItems: 'center',
  //   justifyContent: 'flex-start',
  // },
});



