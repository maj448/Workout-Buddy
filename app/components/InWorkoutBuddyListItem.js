import {View, Text, StyleSheet, ScrollView} from 'react-native';
import RemoteImage from './RemoteImage';


export default function InternalWorkoutBuddyListItem({buddie}) {
    if (!buddie) {
        console.error("buddie is undefined", buddie);
        return null;  // Return null or an error message if workout is undefined
      }

    //   const buddieStatuses = {
    //     checkedIn: { borderColor: 'blue', color: 'blue'},
    //     paused: { borderColor: 'gray', color: 'gray'},
    //     complete: { borderColor: 'green', color: 'green'},
    //   };

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
        //padding: 15,
        //borderRadius: 5,
        
        //justifyContent: 'space-between',
        
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        color: 'green',
        fontFamily: 'fantasy',
        // color: 'white',
        // fontSize: 16,
        //textAlign: 'center',
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
        //borderColor: 'green',
        borderWidth: 3,
    },
    overlay: {
        position: 'absolute',  
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 255, 0, 0.4)',  
    },
})