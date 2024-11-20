import {SafeAreaView} from 'react-native-safe-area-context';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
//import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabase';
import { Redirect} from 'expo-router';



export default function SignUp() {
    //const navigation = useNavigation();
    const [inputFullName, setInputFullName] = useState('')
    const [inputUsername, setInputUsername] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')
    const [inputConfPassword, setInputConfPassword] = useState('')
    const [loading, setLoading] = useState(false);

    // const gotoLoginScreen = () => {
	// 	navigation.navigate('Login');
	// };

    async function signUpWithEmail()
    {

        if (inputPassword !== inputConfPassword) {
            Alert.alert("Passwords don't match");
            return;
          }

        setLoading(true);
        const {data, error} = await supabase.auth.signUp({ email: inputEmail, password : inputPassword});

        if (error) {
            Alert.alert(error.message);
            setLoading(false);
            return;
        }

        if (data.user) {
            const { error } = await supabase
              .from('profiles')
              .upsert([
                {
                  id: data.user.id,
                  full_name: inputFullName,
                  username: inputUsername,
                },
              ], { });
      
            if (error) {
              Alert.alert('Error creating profile', error.message);
              setLoading(false);
              return;
            }
      
            Alert.alert('Account Created', 'Your account has been successfully created!');
      
            //navigation.navigate('Login');
          }
      
          setLoading(false);
          return <Redirect href={'/Login'} />;
    }

    return(
        <SafeAreaView style={styles.container}>
            
            <View style={styles.inputArea}>
                <Text style={styles.label}>Full name:</Text>
                <TextInput
                style={styles.inputBox}
                keyboardType="default"
                value={inputFullName}
                onChangeText={setInputFullName}/>

            </View>
            <View style={styles.inputArea}>
                <Text style={styles.label}>Username:</Text>
                <TextInput
                style={styles.inputBox}
                keyboardType="default"
                value={inputUsername}
                onChangeText={setInputUsername}/>

            </View>
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
            <View style={styles.inputArea}>
                <Text style={styles.label}>Confirm Pwd:</Text>
                <TextInput
                style={styles.inputBox}
                secureTextEntry
                keyboardType="default"
                value={inputConfPassword}
                onChangeText={setInputConfPassword}/>

            </View>

            <Button title={loading ? 'Creating account...' : 'Create Account'} disabled={loading} onPress={signUpWithEmail}/>


        </SafeAreaView>
    )

}



const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6EEB92',
        justifyContent: 'center',
        alignContent: 'center',
        flex: 1,
    },
    header: {
        color: 'blue',
        fontSize: 36,
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

// (( SELECT auth.uid() AS uid) = id)