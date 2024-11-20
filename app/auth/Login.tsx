import {SafeAreaView} from 'react-native-safe-area-context';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabase';
import { useAuth } from '../providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';



export default function Login() {

    const navigation = useNavigation();
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const {session} = useAuth();

  

    const gotoSignUpScreen = () => {
		navigation.navigate('Sign Up');
	};



    async function signInWithEmail()
    {
        setLoading(true);
       const {error} = await supabase.auth.signInWithPassword({ email: inputEmail, password : inputPassword});

       if (error) Alert.alert(error.message)
        else navigation.navigate('Tabs');
        setLoading(false);


    }




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
                secureTextEntry
                keyboardType="default"
                value={inputPassword}
                onChangeText={setInputPassword}/>

            </View>
            </View>

            <Button title={loading ? 'Logging in...' : 'Login'} disabled={loading} onPress={signInWithEmail}/>
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