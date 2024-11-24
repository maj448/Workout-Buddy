
import {SafeAreaView} from 'react-native-safe-area-context';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './utils/supabase';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './providers/AuthProvider';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';


import {useState, useEffect} from 'react';

import { ActivityIndicator } from 'react-native';
import { useAddBuddy } from './api/buddies';


export default function Buddy() {

  const { session } = useAuth();
  const user_id = session?.user.id;
  const [inputUsername, setInputUsername] = useState('');

  const {mutate: insertBuddy} = useAddBuddy();
 
    const navigation = useNavigation();
    const onAddBuddy = () => {
        //call function to add buddy
        insertBuddy({user_id : user_id, username : inputUsername})
        
        navigation.goBack();
      };

    return (
      <View style={styles.container}>
        <View style={styles.inputArea}>
          <Text style={styles.label}>Add Buddy with Username:</Text>
          <AutoGrowingTextInput
              style={styles.inputBox}
              placeholder={'(Required) username'}
              keyboardType="default"
              value={inputUsername}
              onChangeText={setInputUsername}
          />
        </View>
        <View style={{flex:6}}>

        </View>

        <View style={styles.buttonContainer}>
            <Pressable onPress={onAddBuddy}  style={styles.button}>
                <Text style={styles.buttonText}>Add </Text>
            </Pressable>
        </View>
      </View>
    );
  }


  const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    color: '#3D3D3D',
    fontFamily: 'fantasy',
    flex: 2,
  
  },
inputArea:{
    //flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    //gap: 10,
    flex: 2

},
inputBox: {
  height: 40,
  borderColor: 'lightgray',
  backgroundColor: 'white',
  borderWidth: 2,
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  padding: 10,
  flex: 1,
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
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#A4F39C', 
    //justifyContent: 'center',
    //alignItems: 'center',
  },
});