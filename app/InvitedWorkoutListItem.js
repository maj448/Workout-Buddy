import {View, Text, StyleSheet, Pressable, Alert} from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import { format, parseISO} from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { useRemoveWorkout } from './api/workouts';
import { useAuth } from './providers/AuthProvider';




  const workoutStatuses = {
    pending: { backgroundColor: 'blue', },
    completed: { backgroundColor: 'green', },
    upcoming: { backgroundColor: 'orange', },
    missed: { backgroundColor: 'red', },
  };

export default function InvitedWorkoutListItem({ workout }) {
    if (!workout) {
        console.error("workout is undefined", workout);
        return null;  
      }

    const {session} = useAuth();

    const { mutate: removeWorkout } = useRemoveWorkout();

    const navigation = useNavigation()

    const formatTime = (date) => {

      date = `${date}Z`
      date = new Date(date);
      return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true});


    };

    const gotoDetailsScreen = () => {
        if (workout) {
            navigation.navigate('Workout Details', {workout: workout });
        } else {
            alert('No workout data available');
        }
	};

    const onRemove = () => {
        //const data = [{user_id : session.user.id}, {workout_id : workout.id}]
        removeWorkout({user_id : session.user.id, workout_id : workout.id});

    
      };

    const confirmRemove = () => {
    Alert.alert('Confirm', 'Are you sure you want to remove this workout?', [
        {
        text: 'Cancel',
        },
        {
        text: 'Delete',
        style: 'destructive',
        onPress: onRemove,
        },
    ]);
    };

    const backgroundColorOnStatus = workoutStatuses['pending']

    return(
        <Pressable onPress={gotoDetailsScreen} onLongPress={confirmRemove}>
        <View style= {[styles.container, backgroundColorOnStatus]}>
            <Text style= {styles.text}>
                {workout.title}
            </Text>
            {/* <Text style={styles.time}>Start: {displayStartTime}</Text>
            <Text style={styles.time}>End: {displayEndTime}</Text> */}
            <Text style={styles.time}>{formatTime(workout.start_time)} to {formatTime(workout.end_time)}</Text>
        </View>
        </Pressable>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
    time: {
        fontSize: 14,
        color: 'white',
      },
})