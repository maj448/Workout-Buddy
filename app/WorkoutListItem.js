import {View, Text, StyleSheet} from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import { format, parseISO} from 'date-fns';

export default function WorkoutListItem({ task }) {
    if (!task) {
        console.error("Task is undefined", task);
        return null;  // Return null or an error message if task is undefined
      }

    const displayStartTime = format(parseISO(task.start_time), 'h:mm a')
    const displayEndTime = format(parseISO(task.end_time), 'h:mm a')
    return(
        <View style= {styles.container}>
            <Text style= {styles.text}>
                {task.title}
            </Text>
            {/* <Text style={styles.time}>Start: {displayStartTime}</Text>
            <Text style={styles.time}>End: {displayEndTime}</Text> */}
            <Text style={styles.time}>{displayStartTime} to {displayEndTime}</Text>
        </View>

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