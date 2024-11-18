import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Button} from 'react-native';
import {useState, useEffect} from 'react';

const NewWorkoutScreen = ({selected}) => {
  const [inputTitle, setInputTitle] = useState('');
  const [inputNotes, setInputNotes] = useState('');
  const [inputDate, setInputDate] = useState({selected});
  const [inputStartTime, setInputStartTime] = useState('');
  const [inputEndTime, setInputEndTime] = useState('');


  return (
    <KeyboardAvoidingView  style={styles.modalContainer}>
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
});

export default NewWorkoutScreen;