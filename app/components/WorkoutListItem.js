import {View, Text, StyleSheet, Pressable, Alert, TouchableOpacity} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useRemoveWorkout } from '../api/workouts';
import { useAuth } from '../providers/AuthProvider';




  const workoutStatuses = {
    pending: { backgroundColor: 'blue', },
    past: { backgroundColor: 'gray', },
    complete: { backgroundColor:  'limegreen' },
    upcoming: { backgroundColor: '#F39D06', },
  };

export default function WorkoutListItem({ workout }) {
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
            navigation.navigate('Workout Details', {user_id : session.user.id, workout: workout.workouts });
        } else {
            alert('No workout data available');
        }
	};

    const onRemove = () => {
        removeWorkout({user_id : session.user.id, workout_id : workout.workouts.id});
    };

    const confirmRemove = () => {
    Alert.alert('Confirm', 'Are you sure you want to remove this workout?', [
        {text: 'Cancel',},{text: 'Delete', style: 'destructive',onPress: onRemove,},
    ]);
    };

    let backgroundColorOnStatus
    if(workout.status == 'complete')
        backgroundColorOnStatus = workoutStatuses['complete']
    else
        backgroundColorOnStatus = workoutStatuses[workout.workouts.workout_status]

    return(
        <TouchableOpacity onPress={gotoDetailsScreen} onLongPress={confirmRemove}>
        <View style= {[styles.container, backgroundColorOnStatus]}>
            <Text style= {styles.text}>
                {workout.workouts.title}
            </Text>
            <Text style={styles.time}>{formatTime(workout.workouts.start_time)} to {formatTime(workout.workouts.end_time)}</Text>
        </View>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center', 
    },
    text: {
        color: 'white',
        fontSize: 20,
        maxWidth: '50%',
        textAlign: 'center'
    },
    time: {
        fontSize: 16,
        color: 'white',
        alignSelf: 'center'
    },
})