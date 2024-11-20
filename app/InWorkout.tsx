import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, FlatList } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Stopwatch} from 'react-native-stopwatch-timer';
import { useNavigation } from '@react-navigation/native';


export default function InWorkout() {
  const navigation = useNavigation()

  const gotoDetails = () => {
    navigation.navigate('Workout Details');
  };
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);

  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.container}>

        <View style={styles.sectionStyle}>
          <Stopwatch
            start={isStopwatchStart}

            options={options}
            // Options for the styling
          />
          <TouchableHighlight
            onPress={() => {
              setIsStopwatchStart(!isStopwatchStart);
            }}>
            <Text style={styles.buttonText}>
              {!isStopwatchStart ? 'Start' : 'Pause'}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              //setIsStopwatchStart(false);gotoDetails
              navigation.goBack()}}>
            <Text style={styles.buttonText}>End</Text>
          </TouchableHighlight>
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
  buttonText: {
    fontSize: 20,
    marginTop: 10,
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


