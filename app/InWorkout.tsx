import React, { useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUpdateParticipantStatus } from './api/workouts';
import StopwatchContainer from './components/Stopwatch.container'


export default function InWorkout({route}) {
  const navigation = useNavigation()
  const isFocused = useIsFocused();
  const {user_id, workout_id} = route.params;
  const [isStopwatchStarted, setIsStopwatchStarted] = useState(false);
  const [duration, setDuration] = useState(0);

  const {mutate: updateParticipantStatus} = useUpdateParticipantStatus();

  const onEnd = () => {
    //update activity and duration of participant
    updateParticipantStatus({user_id : user_id, workout_id : workout_id, status : 'complete', duration : duration , activity : 'N/A'},
      {
        onSuccess: () => {
          navigation.goBack();
        },
      }
    )
    
  }

  const returnToDetails = () => {
    navigation.goBack()
  }



  // const getFormattedTime = (time: string) => {
  //   const milliseconds = parseInt(time, 10); 
  //   setDuration(milliseconds); 
  // };
  //console.log(duration)

  useEffect(() => {
    if (!isFocused && isStopwatchStarted) {
      setIsStopwatchStarted(true); 
    } 

    // const saveTimerState = async (isStopwatchStarted, elapsedTime) => {
    //   await AsyncStorage.setItem('isTimerRunning', JSON.stringify(isStopwatchStarted));
    //   await AsyncStorage.setItem('elapsedTime', JSON.stringify(elapsedTime));
    // };

    // const loadTimerState = async () => {
    //   const isRunning = JSON.parse(await AsyncStorage.getItem('isTimerRunning')) || false;
    //   const elapsedTime = JSON.parse(await AsyncStorage.getItem('elapsedTime')) || 0;
    //   return { isRunning, elapsedTime };
    // };

    console.log(duration)
  }, [isFocused, isStopwatchStarted, duration]);

  return (

    <SafeAreaView style={styles.container}>
      <Pressable onPress={returnToDetails}  style={styles.button}>
        <Text style={styles.buttonText}>Return to Details </Text>
      </Pressable>
      <View style={styles.container}>

        <View style={styles.sectionStyle}>

          <StopwatchContainer/>
          <Pressable
            style={styles.button}
            onPress={() => {setIsStopwatchStarted(!isStopwatchStarted);}}>
            <Text style={styles.buttonText}>
              {!isStopwatchStarted ? 'Start' : 'Pause'}
            </Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={onEnd}>
            <Text style={styles.buttonText}>End</Text>
          </Pressable>
        </View>
        
      </View>
    </SafeAreaView>
    // <View style={styles.container}>

    //   <View style={styles.stopwatchContainer}>
    //     <Text style={styles.stopwatchText}></Text>
    //   </View>

    //   <View style={styles.buddiesContainer}>
    //     {/* <FlatList
    //       data={buddies}
    //       renderItem={renderBuddy}
    //       keyExtractor={item => item.id.toString()}
    //       horizontal
    //       showsHorizontalScrollIndicator={false}
    //     /> */}
    //   </View>

    //   {/* Buttons: Pause/End Workout */}
    //   <View style={styles.buttonsContainer}>
    //     <Button title={ 'Start'}  />
    //     <Button title="End Workout"  color="red" />
    //   </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
  sectionStyle: {
    flex: 1,
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // buttonText: {
  //   fontSize: 20,
  //   marginTop: 10,
  // },
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
    flex:2, 
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

const options = {
  container: {
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 5,
    //flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    color: '#FFF',
    marginLeft: 7,
  },
};


