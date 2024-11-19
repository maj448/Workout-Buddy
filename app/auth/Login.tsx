import {SafeAreaView} from 'react-native-safe-area-context';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';



export default function Login() {

    const navigation = useNavigation();
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');

    const gotoSignUpScreen = () => {
		navigation.navigate('Sign Up');
	};

    const gotoTabsScreen = () => {
		navigation.navigate('Tabs');
	};


    return (

        <SafeAreaView style={styles.container}>
            <View style={{flex: 4 }}>
            <Text style={styles.header}>Workout Buddy</Text>
            </View>

            <View style={{flex: 5}}>
            <View style={styles.inputArea}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                style={styles.inputBox}
                keyboardType="default"
                value={inputEmail}
                onChangeText={setInputEmail}/>

            </View>

            <View style={styles.inputArea}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                style={styles.inputBox}
                keyboardType="default"
                value={inputPassword}
                onChangeText={setInputPassword}/>

            </View>
            </View>

            <Button title='Login'  onPress={gotoTabsScreen}/>
            <Button title='Sign Up'  onPress={gotoSignUpScreen}/>
            


        </SafeAreaView>

    );

};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6EEB92',
        justifyContent: 'center',
        alignContent: 'center',
        flex: 1,
    },
    header: {
        color: '#3D3D3D',
        fontSize: 70,
        padding: 20,
        justifyContent: 'center',
        alignContent: 'center',
        fontWeight: 'bold',
        fontFamily: 'fantasy'

    },
    label: {
        fontSize: 20,
        color: '#3D3D3D',
        fontFamily: 'fantasy'
      },
    inputArea:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    inputBox: {
        width: 200,
        height: 40,
        borderColor: 'lightgray',
        backgroundColor: 'white',
        borderWidth: 2,
        marginBottom: 15,
        paddingHorizontal: 10,
      },


    

})