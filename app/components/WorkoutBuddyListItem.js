import { Text, StyleSheet, Pressable, Alert, TouchableOpacity} from 'react-native'
import { useRemoveBuddie } from '../api/buddies';
import { useAuth } from '../providers/AuthProvider';



export default function WorkoutBuddyListItem({ buddie }) {

    const {session} = useAuth();

    const { mutate: removeBuddie } = useRemoveBuddie(); 

    if (!buddie) {
        console.error("buddie is undefined", buddie);
        return null;  
      }

    const onRemove = () => {
        removeBuddie({user_id : session.user.id, buddy_id : buddie.id});
    };

    const confirmRemove = () => {
    Alert.alert('Confirm', 'Are you sure you want to remove this buddy?', [
        {text: 'Cancel',},
        {text: 'Delete',style: 'destructive',onPress: onRemove,},
    ]);
    };


    return(

        <TouchableOpacity style= {styles.container} onLongPress={confirmRemove}>
            <Text style= {styles.text}>
               {buddie.username}
            </Text>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'lightgray'
    },
    text: {
        color: 'black',
        fontSize: 16,
    },
    time: {
        fontSize: 14,
        color: 'white',
      },
})