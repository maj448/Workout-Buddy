

import { View, Text, TextInput, StyleSheet, Pressable, Alert, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from './providers/AuthProvider';

import {useState, useEffect} from 'react';


import { useAddBuddy } from './api/buddies';


export default function Buddy() {

  const { session } = useAuth();
  const user_id = session?.user.id;
  const [inputUsername, setInputUsername] = useState('');
  

  const {mutate: insertBuddy} = useAddBuddy();
 
    const navigation = useNavigation();
    const onAddBuddy = () => {
        //call function to add buddy
        insertBuddy({user_id : user_id, username : inputUsername},
          {
            onSuccess: () => {
              //resetFields();
              navigation.goBack();
            },
            onError: (error) => {
              //Alert.alert('Error', error.message );
              Alert.alert('Error', 'Cannot find user with that username.' );
              //setLoading(false);
            },
      })
        
       
      };

    return (
      <View style={styles.container}>
        <View style={styles.inputArea}>
          <Text style={styles.label}>Add Buddy with Username:</Text>
          <TextInput
              style={styles.inputBox}
              placeholder={'(Required) username'}
              keyboardType="default"
              value={inputUsername}
              onChangeText={setInputUsername}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onAddBuddy}  style={styles.button}>
                <Text style={styles.buttonText}>Add </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <KeyboardAvoidingView style={{flex:6}}>

        </KeyboardAvoidingView> */}

        
      </View>
    );
  }


  const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    color: '#3D3D3D',
    fontFamily: 'fantasy',
    //flex: 1,
    margin: 10,
  
  },
inputArea:{
    //flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    //gap: 10,
    //flex: 2

},
inputBox: {
  height: 50,
  borderColor: 'lightgray',
  backgroundColor: 'white',
  borderWidth: 2,
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  padding: 10,
  //flex: 1,
  width: '90%'
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10
    //flex: 1
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#6EEB92'
    //backgroundColor: '#A4F39C', 
    //justifyContent: 'center',
    //alignItems: 'center',
  },
});