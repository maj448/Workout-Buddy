//This code renders the stopwatch time in a started workout

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StopwatchContainer = ({  time}) => {

  return (
    <View style={styles.stopwatchContainer}>
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