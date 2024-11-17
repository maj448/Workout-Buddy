import {View, Text, StyleSheet} from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function WorkoutListItem({ task }) {
    if (!task) {
        console.error("Task is undefined", task);
        return null;  // Return null or an error message if task is undefined
      }
    return(
        <View style= {styles.container}>
            <Text style= {styles.text}>
                {task.title}
            </Text>
            <AntDesign name="close" size={24} color="gray" />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        color: 'white',
        fontSize: 16,
    }
})