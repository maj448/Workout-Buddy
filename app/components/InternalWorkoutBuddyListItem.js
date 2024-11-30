import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import RemoteImage from './RemoteImage';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';


export default function InternalWorkoutBuddyListItem({ buddie, forNew, workout}) {
    if (!buddie) {
        console.error("buddie is undefined", buddie);
        return null;  // Return null or an error message if workout is undefined
      }
      const navigation = useNavigation();
      const [workoutComplete, setWorkoutComplete] = useState(false)


      useEffect(() => {
        if( workout && buddie.status == 'complete')
        {
            setWorkoutComplete(true)
        }
    }, [workout, buddie.status]);


      let colorOnStatus
      if(buddie.status == 'checked in')
          colorOnStatus = { backgroundColor: 'blue'}
      else if(buddie.status == 'complete' || buddie.status == 'in workout')
          colorOnStatus = { backgroundColor: 'green'}
      else 
          colorOnStatus = { backgroundColor: 'gray'}


        const viewBuddyStats = () => {
            navigation.push('Workout Details', {user_id : buddie.profiles.id, workout: workout });
            
        }

    return(

        <TouchableOpacity style= {[styles.container, colorOnStatus]} disabled={!workoutComplete} onPress={viewBuddyStats }>
            <RemoteImage
                path={buddie.profiles.avatar_url}
                fallback='https://img.icons8.com/nolan/64/user-default.png'
                style={styles.image}
                resizeMode="contain"
            />

            <Text style= {styles.text}>
               {buddie.profiles.username}
            </Text>
            { !forNew &&
            <Text style={styles.stat}>{buddie.invite_status ? buddie.invite_status : buddie.status}</Text>
            }
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 5,
        flexDirection: 'row',
        //backgroundColor: 'lightblue',
        alignItems: 'center'
    },

    text: {
        fontSize: 22,
        color: 'white',
        //textAlign: 'center',
        paddingLeft: 15,
        flex: 1,
    },

    stat: {
        fontSize: 20,
        color: '#DFDCE0',
        textAlign: 'right',
        paddingLeft: 10,
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