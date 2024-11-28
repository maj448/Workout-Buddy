import {View, Text, StyleSheet} from 'react-native';
import RemoteImage from './RemoteImage';


export default function InternalWorkoutBuddyListItem({ buddie, forNew}) {
    if (!buddie) {
        console.error("buddie is undefined", buddie);
        return null;  // Return null or an error message if workout is undefined
      }

    return(

        <View style= {styles.container}>
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
            <Text>{buddie.invite_status ? buddie.invite_status : buddie.status}</Text>
            }
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 5,
        flexDirection: 'row',
        //justifyContent: 'space-between',
        backgroundColor: 'lightblue',
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        color: '#3D3D3D',
        fontFamily: 'fantasy',
        // color: 'white',
        // fontSize: 16,
        textAlign: 'center',
        padding: 10
    },
    time: {
        fontSize: 20,
        color: '#3D3D3D',
        
        // fontSize: 14,
        // color: 'white',
      },
    image: {
        width: '15%',
        aspectRatio: 1,
        alignSelf: 'center',
        borderRadius: 100,
        borderColor: 'black',
        borderWidth: 2,
        //margin: 10
    },
})