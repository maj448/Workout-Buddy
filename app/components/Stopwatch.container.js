
//https://ghost.codersera.com/blog/first-react-native-app-stopwatch/ source

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
//import { useStopWatch } from './StopWatch';

const StopwatchContainer = ({  time}) => {
  // const {
  //   // actions
  //   start,
  //   stop,
  //   end,
  //   // data
  //   isRunning,
  //   time,
  // } = useStopWatch()
 // const padToTwo = (number) => (number <= 9 ? `0${number}` : number);

  return (
    <View style={styles.stopwatchContainer}>
      {/* <Text style={styles.timeText}>{padToTwo(hr)} : {padToTwo(min)} : {padToTwo(sec)}</Text> */}
      <Text style={styles.timeText}>{time}</Text>
    </View>
  );
};

export default StopwatchContainer;


const styles = StyleSheet.create({
	stopwatchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        flex: 3,
        width: '100%',

      },
      timeText: {
        fontSize: 50,
        color: 'white',
      },
});