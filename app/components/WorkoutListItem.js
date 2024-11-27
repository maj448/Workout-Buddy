import {View, Text, StyleSheet, Pressable, Alert} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useRemoveWorkout } from '../api/workouts';
import { useAuth } from '../providers/AuthProvider';




  const workoutStatuses = {
    pending: { backgroundColor: '#4A90E2', borderColor: '#357ABD',},
    past: { backgroundColor: '#B0B0B0', borderColor: '#8A8A8A',},
    complete: { backgroundColor:  '#1E7A56', borderColor: '#165A3F',},
    upcoming: { backgroundColor: '#FFCC00', borderColor: '#D66A00',},
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
            navigation.navigate('Workout Details', {workout: workout.workouts });
        } else {
            alert('No workout data available');
        }
	};

    const onRemove = () => {
        //const data = [{user_id : session.user.id}, {workout_id : workout.id}]
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
        <Pressable onPress={gotoDetailsScreen} onLongPress={confirmRemove}>
        <View style= {[styles.container, backgroundColorOnStatus]}>
            <Text style= {styles.text}>
                {workout.workouts.title}
            </Text>
            <Text style={styles.time}>{formatTime(workout.workouts.start_time)} to {formatTime(workout.workouts.end_time)}</Text>
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
        //borderColor: '#4B4B4B',
        borderWidth: 2, 
    },
    text: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'fantasy',
        maxWidth: '200'
    },
    time: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'fantasy'
      },
})