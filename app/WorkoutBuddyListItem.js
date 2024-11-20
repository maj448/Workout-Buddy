import {View, Text, StyleSheet, Pressable} from 'react-native'
import { format, parseISO} from 'date-fns';
import { useNavigation } from '@react-navigation/native';



export default function WorkoutBuddyListItem({ buddie }) {
    if (!buddie) {
        console.error("buddie is undefined", buddie);
        return null;  // Return null or an error message if workout is undefined
      }

      //get username from profile table 


    return(

        <View style= {styles.container}>
            <Text style= {styles.text}>
                username
            </Text>
            <Text>invite status</Text>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'blue'
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