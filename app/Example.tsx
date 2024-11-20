import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, FlatList } from 'react-native';

// Type definitions for workout and buddy
interface Buddy {
  id: number;
  avatarUrl: string;
  name: string;
  inviteStatus: 'invited' | 'pending' | 'accepted' | 'checkedIn' | 'completed';
}

interface Workout {
  id: number;
  name: string;
  description: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  buddies: Buddy[];
}

export default function Example() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // Time remaining in minutes
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [workoutEnded, setWorkoutEnded] = useState<boolean>(false);

  // Sample workout data (this would typically come from an API)
  const sampleWorkout: Workout = {
    id: 1,
    name: 'Morning Yoga',
    description: 'A relaxing morning yoga session to start your day.',
    startTime: '2024-11-20T14:20:00Z', // ISO format date string
    endTime: '2024-11-20T11:00:00Z',
    buddies: [
      { id: 1, name: 'John', avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg', inviteStatus: 'accepted' },
      { id: 2, name: 'Jane', avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg', inviteStatus: 'invited' },
      { id: 3, name: 'Alice', avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg', inviteStatus: 'checkedIn' },
      { id: 4, name: 'Bob', avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg', inviteStatus: 'completed' },
    ],
  };

  useEffect(() => {
    if (sampleWorkout) {
      setWorkout(sampleWorkout);
      const workoutStartTime = new Date(sampleWorkout.startTime);
      const workoutEndTime = new Date(sampleWorkout.endTime);

      // Calculate remaining time in minutes
      const remaining = Math.floor((workoutStartTime.getTime() - currentTime.getTime()) / 60000);
      setTimeRemaining(remaining);

      // Check if the workout has ended
      const hasEnded = currentTime > workoutEndTime;
      setWorkoutEnded(hasEnded);
    }
  }, [currentTime]);

  // Format time in minutes
  const formatTime = (minutes: number) => {
    return `${minutes} min remaining`;
  };

  // Render each buddy's avatar and status
  const renderBuddy = ({ item }: { item: Buddy }) => {
    return (
      <View style={styles.buddyContainer}>
        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
        <Text style={styles.buddyName}>{item.name}</Text>
        <Text style={styles.buddyStatus}>{item.inviteStatus}</Text>
      </View>
    );
  };

  // Render buddy avatars in left or right container based on check-in status
  const renderBuddyAvatars = () => {
    const checkedInBuddies = workout?.buddies.filter(buddy => buddy.inviteStatus === 'checkedIn');
    const notCheckedInBuddies = workout?.buddies.filter(buddy => buddy.inviteStatus !== 'checkedIn' && buddy.inviteStatus !== 'completed');

    return (
      <View style={styles.avatarContainer}>
        <View style={styles.checkedInBuddies}>
          {checkedInBuddies?.map(buddy => (
            <Image key={buddy.id} source={{ uri: buddy.avatarUrl }} style={[styles.avatar, styles.checkedIn]} />
          ))}
        </View>
        <View style={styles.notCheckedInBuddies}>
          {notCheckedInBuddies?.map(buddy => (
            <Image key={buddy.id} source={{ uri: buddy.avatarUrl }} style={styles.avatar} />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Half: Workout Details */}
      <View style={styles.workoutDetailsContainer}>
        <Text style={styles.workoutTitle}>{workout?.name}</Text>
        <Text style={styles.workoutDescription}>{workout?.description}</Text>
        <Text style={styles.timeRemaining}>{formatTime(timeRemaining)}</Text>
      </View>

      {/* Bottom Half: Conditional Display Based on Time and Workout Status */}
      <View style={styles.buddiesContainer}>
        {timeRemaining > 10 ? (
          // List invited buddies if more than 10 minutes to start time
          <FlatList
            data={workout?.buddies.filter(buddy => buddy.inviteStatus !== 'completed')}
            renderItem={renderBuddy}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : workoutEnded ? (
          // Show completed buddies after the workout has ended
          <FlatList
            data={workout?.buddies.filter(buddy => buddy.inviteStatus === 'completed')}
            renderItem={renderBuddy}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          // Show buddy avatars based on check-in status if within 10 minutes of start time
          renderBuddyAvatars()
        )}
      </View>

      {/* Buttons for workout actions */}
      <View style={styles.buttonsContainer}>
        <Button title="Pause Workout" onPress={() => {}} />
        <Button title="End Workout" onPress={() => setWorkoutEnded(true)} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  workoutDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  workoutDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 10,
  },
  timeRemaining: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6347', // Tomato color for remaining time
  },
  buddiesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buddyContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  buddyName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buddyStatus: {
    fontSize: 12,
    color: '#777',
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  checkedInBuddies: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  notCheckedInBuddies: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,
  },
  checkedIn: {
    borderColor: 'green',
    borderWidth: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
});

