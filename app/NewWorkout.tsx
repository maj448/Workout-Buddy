import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Button, Pressable, ActivityIndicator, ScrollView, Alert} from 'react-native';
import {useState, useEffect} from 'react';
import { useAuth } from './providers/AuthProvider';
import { useInsertWorkout} from './api/workouts';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO, startOfSecond} from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import InternalWorkoutBuddiesList from './components/InternalWorkoutBuddiesList';
import { userBuddies } from './api/buddies';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';



const NewWorkoutScreen = ({route}) => {
  const { session } = useAuth();
  const user_id = session?.user.id;
  const navigation = useNavigation();
  const {selected} = route.params;

  const [inputTitle, setInputTitle] = useState('');
  const [inputNotes, setInputNotes] = useState('');
  const today = new Date();
  const [inputDate, setInputDate] = useState(new Date(parseISO(selected)));
  const [inputStartTime, setInputStartTime] = useState(new Date(parseISO(selected)));
  const [inputEndTime, setInputEndTime] = useState(new Date(parseISO(selected)));
  const [open, setOpen] = useState(false)
  const [openStart, setOpenStart] = useState(false)
  const [openEnd, setOpenEnd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inviteBuddyList, setInviteBuddyList] = useState('')

  const {data: buddies, isLoading : isLoadingBuddies} = userBuddies(session?.user.id);

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
    setInputStartTime(new Date(currentDate.setHours(inputStartTime.getHours(), inputStartTime.getMinutes())));
    setInputEndTime(new Date(currentDate.setHours(inputEndTime.getHours(), inputEndTime.getMinutes())));
    setOpen(false)
  };

  const onChangeStart = (event, selectedStart) => {
    const start = new Date(inputDate.setHours(selectedStart.getHours(), selectedStart.getMinutes())) || inputStartTime;
    setInputStartTime(start);
    setOpenStart(false)
    
  };


  const onChangeEnd = (event, selectedEnd) => {
    const end = new Date(inputDate.setHours(selectedEnd.getHours(), selectedEnd.getMinutes())) || inputEndTime;
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

  const formatTime = (date) => {

    if (!(date instanceof Date)) {
        date = new Date(date);
      }
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true});


  };

  const onSubmitHandler = () => {
    setLoading(true)
    insertWorkout({inputTitle, inputNotes, inputDate, inputStartTime, inputEndTime, user_id, inviteBuddyList},
      {
        onSuccess: () => {
          resetFields();
          navigation.navigate('Tabs');
        },
        onError: (error) => {
          Alert.alert('Error', error.message );
          setLoading(false);
        },
      });  
  };

  // if (loading) {
  //   return <ActivityIndicator />;
  // }

  const handleBuddyInviteList = (buddy) => {
      setInviteBuddyList(buddy)
      
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <KeyboardAvoidingView style={styles.container}>

        <View style={styles.inputArea}>
          <Text style={styles.label}>Title:</Text>
          <AutoGrowingTextInput
              style={styles.inputBox}
              placeholder={'(Required) Add a title ex. Walk'}
              keyboardType="default"
              value={inputTitle}
              onChangeText={setInputTitle}
          />
        </View>
        <View style={styles.inputArea}>
          <Text style={styles.label}>Date:</Text>
        <Pressable onPress={showDatepicker} style={styles.inputBox}>
          <Text >{inputDate.toLocaleDateString()}</Text>
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
        </View>
 
        <View style={styles.inputArea}>
          <Text style={styles.labelSmall}>Start:</Text>
        <Pressable onPress={showStartpicker} style={styles.inputBoxSmall}>
          <Text >{formatTime(inputStartTime)}</Text>

        </Pressable>

        {openStart && (
          <DateTimePicker
            testID="dateTimePicker"
            value={inputStartTime}
            mode="time"
            display="spinner"
            minuteInterval={15}
            onChange={onChangeStart}
          />
        )}

        <Text style={styles.labelSmall}>End:</Text>
        <Pressable onPress={showEndpicker} style={styles.inputBoxSmall}>
          <Text >{formatTime(inputEndTime)}</Text>

        </Pressable>
        {openEnd && (
          <DateTimePicker
            testID="dateTimePicker"
            value={inputEndTime}
            mode="time"
            display="spinner"
            minuteInterval={15}
            onChange={onChangeEnd}
          />
        )}

        </View>

        <View style={styles.inputArea}>
        <Text style={styles.label}>Notes:</Text>
        <AutoGrowingTextInput 
        style={styles.inputBox} 
        placeholder={'(Optional) Add Notes'}
        keyboardType="default"
        value={inputNotes}
        multiline = {true}
        numberOfLines={10}
        onChangeText={setInputNotes}
         />

        </View>
      </KeyboardAvoidingView>
      <InternalWorkoutBuddiesList buddies={buddies} forNew={true} OnAddBuddyToInvites ={handleBuddyInviteList} allParticipants={[]} allInvitations={[]} workout_id={null}/>
      <View style={styles.buttonContainer}>
            <Pressable onPress={onSubmitHandler} disabled={loading} style={styles.button}>
                <Text style={styles.buttonText}>{loading ? 'Creating Workout...' : 'Create Workout'} </Text>
            </Pressable>
            </View>
  
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#6EEB92', 
    gap: 10, 
  },
  container: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6EEB92',
    padding: 10, 
    gap: 10, 
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
    //flex:3, 
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 20,
    color: '#3D3D3D',
    fontFamily: 'fantasy',
    flex: 2
  },
inputArea:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    
    //padding: 20,
    gap: 10,
    flex: 1

},

inputBoxBig: {
  //width: 200,
  height: 100,
  borderColor: 'lightgray',
  backgroundColor: 'white',
  //justifyContent: 'flex-start',
  //alignItems: 'flex-start',
  borderWidth: 2,
  marginBottom: 15,
  paddingHorizontal: 10,
  flex: 6,
},
inputBox: {
  //width: 200,
  height: 40,
  borderColor: 'lightgray',
  backgroundColor: 'white',
  borderWidth: 2,
  justifyContent: 'center',
  alignItems: 'center',
  //marginBottom: 15,
  paddingHorizontal: 10,
  //marginBottom: 15,
  //paddingHorizontal: 10,
  flex: 6,
},
labelSmall: {
  fontSize: 20,
  color: '#3D3D3D',
  fontFamily: 'fantasy',
  flex: 3
},
inputBoxSmall: {
  //width: 200,
  height: 40,
  borderColor: 'lightgray',
  backgroundColor: 'white',
  borderWidth: 2,
  justifyContent: 'center',
  alignItems: 'center',
  //marginBottom: 15,
  //paddingHorizontal: 5,
  flex: 5,
},


});

export default NewWorkoutScreen;