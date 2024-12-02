//This file renders a single workout buddy in a started workout
import {View, Text, StyleSheet} from 'react-native';
import RemoteImage from './RemoteImage';


export default function InternalWorkoutBuddyListItem({buddie}) {
    if (!buddie) {
        console.error("buddie is undefined", buddie);
        return null;  
      }

    //change the color based on the status
    let colorOnStatus
    if(buddie.status == 'checked in')
        colorOnStatus = { borderColor: 'blue', color: 'blue'}
    else if(buddie.status == 'complete' || buddie.status == 'in workout')
        colorOnStatus = { borderColor: 'green', color: 'green'}
    else 
        colorOnStatus = { borderColor: 'gray', color: 'gray'}

    return(
        

        <View style= {styles.container}>
            <View style={styles.imageContainer}>
                <RemoteImage
                    path={buddie.profiles.avatar_url}
                    fallback='https://img.icons8.com/nolan/64/user-default.png'
                    style={[styles.image, colorOnStatus]}
                    resizeMode="contain"
                />

                {buddie.status == 'complete' &&
                    <View style={styles.overlay}></View>
                }
            </View>

            <Text style= {[styles.text, colorOnStatus]}>
               {buddie.profiles.username}
            </Text>


        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        
        alignItems: 'center'
    },

    text: {
        fontSize: 20,
        fontFamily: 'fantasy',
        padding: 5
    },

    imageContainer: {
        position: 'relative',  
        width: '40%',
        aspectRatio: 1,
        borderRadius: 100,
        overflow: 'hidden',  
    },

    image: {
        width: '100%',
        height: '100%',  
        borderRadius: 100,
        borderWidth: 3,
    },

    overlay: {
        position: 'absolute',  
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 255, 0, 0.4)',  //add a transparent green 
    },
})