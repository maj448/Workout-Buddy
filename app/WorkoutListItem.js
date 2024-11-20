import {View, Text, StyleSheet, Pressable} from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import { format, parseISO} from 'date-fns';
import { useNavigation } from '@react-navigation/native';



  const workoutStatuses = {
    pending: {
      backgroundColor: 'orange', 
    },
    completed: {
      backgroundColor: 'green', 
    },
    upcoming: {
      backgroundColor: 'blue', 
    },
    missed: {
      backgroundColor: 'red', 
    },
  };

export default function WorkoutListItem({ workout }) {
    if (!workout) {
        console.error("workout is undefined", workout);
        return null;  // Return null or an error message if workout is undefined
      }

    const displayStartTime = format(parseISO(workout.start_time), 'h:mm a')
    const displayEndTime = format(parseISO(workout.end_time), 'h:mm a')
    const navigation = useNavigation()

    const gotoDetailsScreen = () => {
        if (workout) {
            navigation.navigate('Workout Details', {workout: workout });
        } else {
            alert('No workout data available');
        }
	};

    const backgroundColorOnStatus = workoutStatuses[workout.workout_status]

    return(
        <Pressable onPress={gotoDetailsScreen}>
        <View style= {[styles.container, backgroundColorOnStatus]}>
            <Text style= {styles.text}>
                {workout.title}
            </Text>
            {/* <Text style={styles.time}>Start: {displayStartTime}</Text>
            <Text style={styles.time}>End: {displayEndTime}</Text> */}
            <Text style={styles.time}>{displayStartTime} to {displayEndTime}</Text>
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