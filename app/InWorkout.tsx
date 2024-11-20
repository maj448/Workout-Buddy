import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, FlatList } from 'react-native';

// Type for each buddy's avatar
interface Buddy {
  id: number;
  avatarUrl: string;
}

export default function InWorkout() {
  // Stopwatch states
  const [time, setTime] = useState<number>(0); // Time in seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [buddies, setBuddies] = useState<Buddy[]>([
    { id: 1, avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: 3, avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { id: 4, avatarUrl: 'https://randomuser.me/api/portraits/women/4.jpg' },
  ]);

  // Stopwatch logic: increments every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isRunning]);

  // Format time to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Start/Pause the stopwatch
  const toggleStopwatch = () => {
    setIsRunning(prev => !prev);
  };

  // End the workout (reset stopwatch and display a message)
  const endWorkout = () => {
    setIsRunning(false);
    setTime(0);
    alert('Workout ended!');
  };

  // Render each buddy's avatar
  const renderBuddy = ({ item }: { item: Buddy }) => (
    <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
  );

  return (
    <View style={styles.container}>
      {/* Top Half: Stopwatch */}
      <View style={styles.stopwatchContainer}>
        <Text style={styles.stopwatchText}>{formatTime(time)}</Text>
      </View>

      {/* Bottom Half: Buddy Avatars */}
      <View style={styles.buddiesContainer}>
        <FlatList
          data={buddies}
          renderItem={renderBuddy}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Buttons: Pause/End Workout */}
      <View style={styles.buttonsContainer}>
        <Button title={isRunning ? 'Pause' : 'Start'} onPress={toggleStopwatch} />
        <Button title="End Workout" onPress={endWorkout} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  stopwatchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  stopwatchText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  buddiesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
});

