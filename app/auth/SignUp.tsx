//This file contains the code for the sign up page
import {SafeAreaView} from 'react-native-safe-area-context';
import { View, ScrollView, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabase';
import { usernameUnique } from '../api/profile';



export default function SignUp() {
    const navigation = useNavigation();
    const [inputFullName, setInputFullName] = useState('')
    const [inputUsername, setInputUsername] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')
    const [inputConfPassword, setInputConfPassword] = useState('')
    const [loading, setLoading] = useState(false);


    //get all usernames from the database
    const {data : allUsernames} = usernameUnique();


    const validation = async() => {

        //Make sure the full name is not blank
        if (!inputFullName || inputFullName.trim() === '') {
            Alert.alert("Full Name is required.");
            return;
        }
    
        // make sure username is not blank
        if (!inputUsername || inputUsername.trim() === '') {
            Alert.alert("Username is required.");
            return;
        }

        //make sure password is not blank
        if (!inputPassword || inputPassword.trim() === '') {
            Alert.alert("Password cannot be blank");
            return;
        }

        //make sure password and confirm password match
        if (inputPassword !== inputConfPassword) {
            Alert.alert("Passwords don't match");
            return;
        }

        //check if username has already been used
        if (allUsernames?.find(user => user.username == inputUsername)) {
            Alert.alert("Username is already taken.");
            return;
        }
    
        
        setLoading(true);
        signUpWithEmail()


    }

    async function signUpWithEmail()
    {


        //Sign up
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: inputEmail.trim(),
            password: inputPassword.trim()
        });
        
        if (signUpError) {
            Alert.alert(signUpError.message, 'Email may already be registered');
            setLoading(false);
            return;
        }
        
        //if successfully signed up insert a profile
        if (data.user) {
           
        
            // Insert profile
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert([
                    {
                        id: data.user.id,
                        full_name: inputFullName,
                        username: inputUsername.trim(),
                    }
                ], { onConflict: ['id'] }); 
        
            if (profileError) {
                Alert.alert('Error creating profile', profileError.message);
                setLoading(false);
                return;
            }
        
            Alert.alert('Account Created', 'Your account has been successfully created!');
            navigation.navigate('Login');
        }
        
        setLoading(false);

    }

    return(
        
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <KeyboardAvoidingView >
                    <View style={styles.inputArea}>
                        <Text style={styles.label}>Full name:</Text>
                        <TextInput
                        style={styles.inputBox}
                        keyboardType="default"
                        value={inputFullName}
                        placeholder="John Smith"
                        onChangeText={setInputFullName}/>

                    </View>
                    <View style={styles.inputArea}>
                        <Text style={styles.label}>Username:</Text>
                        <TextInput
                        style={styles.inputBox}
                        keyboardType="default"
                        value={inputUsername}
                        placeholder="John123 (must be unique)"
                        onChangeText={setInputUsername}/>

                    </View>
                    <View style={styles.inputArea}>
                        <Text style={styles.label}>Email:</Text>
                        <TextInput
                        style={styles.inputBox}
                        keyboardType="email-address"
                        value={inputEmail}
                        placeholder="abc123@email.com"
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
                        <Text style={styles.label}>Confirm Password:</Text>
                        <TextInput
                        style={styles.inputBox}
                        secureTextEntry
                        keyboardType="default"
                        value={inputConfPassword}
                        onChangeText={setInputConfPassword}/>

                    </View>


                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={validation} disabled={loading} style={styles.button}>
                            <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Create Account'} </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

            </ScrollView>
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
        fontFamily: 'fantasy',
        maxWidth: '40%'
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
      button: {
        width: 200,
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
        justifyContent: 'flex-start',
      },

      scrollViewContent: {
        paddingBottom: 20,
        flexGrow: 1,
      },

    

})
