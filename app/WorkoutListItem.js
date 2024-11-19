import {View, Text, StyleSheet, Pressable} from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import { format, parseISO} from 'date-fns';
import { useNavigation } from '@react-navigation/native';

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

    return(
        <Pressable onPress={gotoDetailsScreen}>
        <View style= {styles.container}>
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
        backgroundColor: 'green',
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