import React, { useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUpdateParticipantStatus } from './api/workouts';
import StopwatchContainer from './components/Stopwatch.container'


export default function InWorkout({route}) {
  const navigation = useNavigation()
  const {user_id, workout_id} = route.params;

  const {mutate: updateParticipantStatus} = useUpdateParticipantStatus();
  const [start, setStart] = useState(false);
  const [hr, setHr] = useState(0);
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  let interval;

  const handleToggle = () => {
    setStart((prevStart) => !prevStart);
  };

  const handleStart = () => {
    if (start) {
      interval = setInterval(() => {
        setSec((prevSec) => {
          if (prevSec !== 59) {
            return prevSec + 1;
          } else if (min !== 59) {
            setMin(min + 1);
            return 0;
          } else {
            setHr(hr + 1);
            return 0;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
  };

  const formatTime = (hr, min, sec) => {
    return `${padToTwo(hr)}:${padToTwo(min)}:${padToTwo(sec)}`;
  };

  const padToTwo = (number) => (number <= 9 ? `0${number}` : number);

  const onEnd = () => {
    const formattedDuration = formatTime(hr, min, sec); 
    updateParticipantStatus({user_id : user_id, workout_id : workout_id, status : 'complete', duration : formattedDuration , activity : 'N/A'},
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


  useEffect(() => {
    handleStart();
    return () => clearInterval(interval);


  }, [start]);

  return (

    <SafeAreaView style={styles.container}>
      <Pressable onPress={returnToDetails}  style={styles.button}>
        <Text style={styles.buttonText}>Return to Details </Text>
      </Pressable>
      <View style={styles.container}>

        <View style={styles.sectionStyle}>

        <StopwatchContainer 
          hr={hr} 
          min={min} 
          sec={sec} />

          <Pressable
            style={styles.button}
            onPress={handleToggle}>
            <Text style={styles.buttonText}>
              {!start ? 'Start' : 'Pause'}
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


