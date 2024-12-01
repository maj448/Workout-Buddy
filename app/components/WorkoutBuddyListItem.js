
//This code renders a single buddy on the buddies screen
import { Text, StyleSheet, Pressable, Alert} from 'react-native'
import { useRemoveBuddie } from '../api/buddies';
import { useAuth } from '../providers/AuthProvider';
import RemoteImage from './RemoteImage';



export default function WorkoutBuddyListItem({ buddie }) {

    const {session} = useAuth();

    //get the database function to remove a buddy
    const { mutate: removeBuddie } = useRemoveBuddie(); 

    if (!buddie) {
        return null;  
    }

    const onRemove = () => {
        removeBuddie({user_id : session.user.id, buddy_id : buddie.id});
    };

    //Add a confirmation message before deleting a buddy
    const confirmRemove = () => {
    Alert.alert('Confirm', 'Are you sure you want to remove this buddy?', [
        {text: 'Cancel',},
        {text: 'Delete',style: 'destructive',onPress: onRemove,},
    ]);
    };

    


    return(

        <Pressable style= {styles.container} onLongPress={confirmRemove}>
            <RemoteImage
                path={buddie.avatar_url}
                fallback='https://img.icons8.com/nolan/64/user-default.png'
                style={styles.image}
                resizeMode="contain"
            />
            <Text style= {styles.text}>
               {buddie.username}
            </Text>
        </Pressable>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 5,
        flexDirection: 'row',
        backgroundColor: '#818181'
    },
    text: {
        color: 'white',
        fontSize: 30,
        paddingHorizontal: 10,
       textAlign: 'center'
    },
    image: {
        width: '15%',
        aspectRatio: 1,
        alignSelf: 'center',
        borderRadius: 100,
        borderColor: 'black',
        borderWidth: 2,
    },
})