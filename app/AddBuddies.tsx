//This is the screen for adding buddies

import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from './providers/AuthProvider';

import {useState, useEffect} from 'react';


import { useAddBuddy } from './api/buddies';


export default function Buddy() {

  const { session } = useAuth();
  const user_id = session?.user.id;
  const [loading, setLoading] = useState(false)
  const [inputUsername, setInputUsername] = useState('');
  
  //get the database function to add a buddy
  const {mutate: insertBuddy} = useAddBuddy();
 
  const navigation = useNavigation();

  //this function will add a buddy or display and error alert
  const onAddBuddy = () => {
    setLoading(true);
      insertBuddy({user_id : user_id, username : inputUsername},
        {
          onSuccess: () => {
            setLoading(false);
            navigation.goBack();
          },
          onError: (error) => {
            Alert.alert('Error', 'Cannot find user with that username.' );
            setLoading(false);
          },
    })
      
      
  };

    return (
      <View style={styles.container}>
        <View style={styles.inputArea}>
          <Text style={styles.label}>Add Buddy with Username:</Text>
          <TextInput
              style={styles.inputBox}
              placeholder={'(Required) case sensitive username '}
              keyboardType="default"
              value={inputUsername}
              onChangeText={setInputUsername}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onAddBuddy} disabled={loading} style={styles.button}>
                <Text style={styles.buttonText} >{ loading ? 'Adding...'  : 'Add' }</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }


  const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    color: '#3D3D3D',
    fontFamily: 'fantasy',
    margin: 10,
  
  },
inputArea:{
    justifyContent: 'flex-start',
    alignItems: 'center',

},
inputBox: {
  height: 50,
  borderColor: 'lightgray',
  backgroundColor: 'white',
  borderWidth: 2,
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  padding: 10,
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
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#6EEB92'
  },
});