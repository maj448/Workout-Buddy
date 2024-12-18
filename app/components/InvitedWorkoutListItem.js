//This code renders a single item in WorkoutList.
//these are for workouts the user has just been invited to
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useAcceptInvite, useDeclineInvite } from '../api/workouts';
import { useAuth } from '../providers/AuthProvider';



export default function InvitedWorkoutListItem({ workout }) {
    if (!workout) {
        console.error("workout is undefined", workout);
        return null;  
      }

    const {session} = useAuth();

    //get the accept and decline update supabase functions 
    const { mutate: Accept } = useAcceptInvite();
    const { mutate: Decline } = useDeclineInvite();

    const navigation = useNavigation()

    //format the time to local time
    const formatTime = (date) => {
        //need to add a Z to the end of the datetime string to properly convert to local time
        date = `${date}Z`
        date = new Date(date);
        return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true});
    };

    //function to navigate to the details screen
    const gotoDetailsScreen = () => {
        if (workout) {
            navigation.navigate('Workout Details', {workout: workout });
        } else {
            alert('No workout data available');
        }
	};


    const acceptInvite = () => {

        Accept({ user_id : session.user.id, workout_id : workout.id} );

    }

    const decilneInvite = () => {
        Decline({ user_id : session.user.id, workout_id : workout.id} );
    }


    return(
        <TouchableOpacity onPress={gotoDetailsScreen} style={styles.fullContainer} >
        <View style= {styles.container}>
            <Text style= {styles.text}>
                {workout.title}
            </Text>

            <Text style={styles.time}>{formatTime(workout.start_time)} to {formatTime(workout.end_time)}</Text>


        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={acceptInvite}  style={styles.button}>
                <Text style={styles.buttonText}>Accept </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={decilneInvite} style={styles.button}>
                <Text style={styles.buttonText}>Decline</Text> 
            </TouchableOpacity>
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

    button: {
        width: 100,
        height: 40,
        borderColor: 'gray',
        borderWidth: 2,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 10,

    },

    buttonText : {
        fontSize: 16,
        color: '#3D3D3D',
        fontFamily: 'fantasy'
    },

    buttonContainer : {
        flex:3, 
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row'
    },
    
    fullContainer: {
        borderRadius: 5,
        backgroundColor: 'blue',
        marginBottom: 5
    },

})