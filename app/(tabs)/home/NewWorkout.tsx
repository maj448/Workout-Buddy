import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Button} from 'react-native';
import {useState, useEffect} from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../providers/AuthProvider';

const NewWorkoutScreen = ({route}) => {
  const { session } = useAuth();

  const {selected} = route.params;

  const [inputTitle, setInputTitle] = useState('');
  const [inputNotes, setInputNotes] = useState('');
  const [inputDate, setInputDate] = useState(selected);
  const [inputStartTime, setInputStartTime] = useState('');
  const [inputEndTime, setInputEndTime] = useState('');

  useEffect(() => {

    
  }, [, selected]);


  return (
    <KeyboardAvoidingView >
      <Text >Title:</Text>
      <TextInput
          style={styles.inputBox}
          keyboardType="default"
          value={inputTitle}
          onChangeText={setInputTitle}
      />
      <Text >Date:</Text>
      <TextInput
          style={styles.inputBox}
          keyboardType="default"
          value={inputDate}
          onChangeText={setInputDate}
      />
      <Text >Start:</Text>
      <TextInput
          style={styles.inputBox}
          keyboardType="numeric"
          value={inputStartTime}
          onChangeText={setInputStartTime}
      />
      <Text >End:</Text>
      <TextInput
          style={styles.inputBox}
          keyboardType="numeric"
          value={inputEndTime}
          onChangeText={setInputEndTime}
      />
      <Text >Notes:</Text>
      <TextInput
          style={styles.inputBox}
          keyboardType="default"
          value={inputNotes}
          onChangeText={setInputNotes}
      />
      <View style={styles.buttonContainer}>
          <Button title="DONE"  onPress={() => updateItemHandler()}/>
          <Button title="DELETE"  color={'red'} onPress={() => deleteItemHandler()}/>
      </View>
  </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default NewWorkoutScreen;