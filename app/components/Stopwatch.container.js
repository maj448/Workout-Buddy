
//https://ghost.codersera.com/blog/first-react-native-app-stopwatch/ source

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StopwatchContainer = ({ hr, min, sec }) => {
  const padToTwo = (number) => (number <= 9 ? `0${number}` : number);

  return (
    <View style={styles.stopwatchContainer}>
      <Text style={styles.timeText}>{padToTwo(hr)} : {padToTwo(min)} : {padToTwo(sec)}</Text>
    </View>
  );
};

export default StopwatchContainer;


const styles = StyleSheet.create({
	stopwatchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      timeText: {
        fontSize: 50,
        color: '#C89933',
      },
});