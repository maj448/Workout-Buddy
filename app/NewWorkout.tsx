import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Button, Pressable} from 'react-native';
import {useState, useEffect} from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './providers/AuthProvider';
import { useInsertWorkout} from './api/workouts';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO} from 'date-fns';
import { useNavigation } from '@react-navigation/native';


const NewWorkoutScreen = ({route}) => {
  const { session } = useAuth();
  const user_id = session?.user.id;
  const navigation = useNavigation();
  const {selected} = route.params;

  const [inputTitle, setInputTitle] = useState('');
  const [inputNotes, setInputNotes] = useState('');
  const today = new Date();
  const [inputDate, setInputDate] = useState(new Date(parseISO(selected)));
  const [inputStartTime, setInputStartTime] = useState(new Date());
  const [inputEndTime, setInputEndTime] = useState(new Date());
  const [open, setOpen] = useState(false)
  const [openStart, setOpenStart] = useState(false)
  const [openEnd, setOpenEnd] = useState(false)
  const [loading, setLoading] = useState(false)

  const {mutate: insertWorkout} = useInsertWorkout();

  const resetFields = () => {
    setInputTitle('');
    setInputNotes('');
    setInputDate(new Date(parseISO(selected)));
    setInputStartTime(new Date());
    setInputEndTime(new Date());

  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || inputDate;
    setInputDate(currentDate);
    setOpen(false)
  };

  const onChangeStart = (event, selectedStart) => {
    const start = selectedStart || inputStartTime;
    setInputStartTime(start);
    setOpenStart(false)
  };

  const onChangeEnd = (event, selectedEnd) => {
    const end = selectedEnd || inputEndTime;
    setInputEndTime(end);
    setOpenEnd(false)
  };
  
  const showDatepicker = () => {
    setOpen(true);
  };

  const showStartpicker = () => {
    setOpenStart(true);
  };

  const showEndpicker = () => {
    setOpenEnd(true);
  };


  const onSubmitHandler = () => {
    setLoading(true)
    console.log('submitting')
    insertWorkout({inputTitle, inputNotes, inputDate, inputStartTime, inputEndTime, user_id},
      {
        onSuccess: () => {
          resetFields();
          navigation.navigate('Tabs');
        },
      }

    )
    setLoading(false)
    
  }


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
      <Pressable onPress={showDatepicker}>
        <Text>{inputDate.toLocaleDateString()}</Text>

      </Pressable>

      {open && (
        <DateTimePicker
          testID="dateTimePicker"
          value={inputDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={today}
        />
      )}

      <Text >Start:</Text>
      <Pressable onPress={showStartpicker}>
        <Text>{inputStartTime.toLocaleDateString()}</Text>

      </Pressable>

      {openStart && (
        <DateTimePicker
          testID="dateTimePicker"
          value={inputDate}
          mode="time"
          display="spinner"
          onChange={onChangeStart}
        />
      )}

      <Text >End:</Text>
      <Pressable onPress={showEndpicker}>
        <Text>{inputEndTime.toLocaleDateString()}</Text>

      </Pressable>
      {openEnd && (
        <DateTimePicker
          testID="dateTimePicker"
          value={inputDate}
          mode="time"
          display="spinner"
          onChange={onChangeEnd}
        />
      )}

      <Text >Notes:</Text>
      <TextInput
          style={styles.inputBox}
          keyboardType="default"
          value={inputNotes}
          onChangeText={setInputNotes}
      />
      {/* <View style={styles.buttonContainer}>
          <Button title="Submit"  onPress={onSubmitHandler}/>
      </View> */}
      <View style={styles.buttonContainer}>
            <Pressable onPress={onSubmitHandler} disabled={loading} style={styles.button}>
                <Text style={styles.buttonText}>{loading ? 'Creating workout...' : 'Create Workout'} </Text>
            </Pressable>
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
  }
});

export default NewWorkoutScreen;