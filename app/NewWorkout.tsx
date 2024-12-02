//This is the screen to create a new workout

import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity, Pressable, ActivityIndicator, ScrollView, Alert} from 'react-native';
import {useState} from 'react';
import { useAuth } from './providers/AuthProvider';
import { useInsertWorkout} from './api/workouts';
import DateTimePicker from '@react-native-community/datetimepicker';
import {parseISO} from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import InternalWorkoutBuddiesList from './components/InternalWorkoutBuddiesList';
import { userBuddies } from './api/buddies';
import { notifyUserAboutNewInvite } from './utils/notifications';

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
  const [textHeight,setTextHeight] = useState(40);
  const [noteHeight,setNoteHeight] = useState(40);

  const {data: buddies, isLoading : isLoadingBuddies} = userBuddies(session?.user.id);

  const {mutate: insertWorkout} = useInsertWorkout();

  const resetFields = () => {
    setInputTitle('');
    setInputNotes('');
    setInputDate(new Date(parseISO(selected)));
    setInputStartTime(new Date());
    setInputEndTime(new Date());

  };

  if(isLoadingBuddies){
    return <ActivityIndicator/>
  }

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || inputDate; 
    const date = new Date(currentDate); 
  
    setInputDate(date); 
    setInputStartTime(new Date(date.setHours(inputStartTime.getHours(), inputStartTime.getMinutes())));
    setInputEndTime(new Date(date.setHours(inputEndTime.getHours(), inputEndTime.getMinutes())));
  
    setOpen(false);
  };

  const onChangeStart = (event, selectedStart) => {
    const start = new Date(inputDate); 
    start.setHours(selectedStart.getHours(), selectedStart.getMinutes()); 
  
    setInputStartTime(start); 
    setOpenStart(false); 
  };
  

  const onChangeEnd = (event, selectedEnd) => {
    const end = new Date(inputDate); 
    end.setHours(selectedEnd.getHours(), selectedEnd.getMinutes()); 
  
    setInputEndTime(end); 
    setOpenEnd(false); 
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

  const validateFields = async() => {

    if (!inputTitle.trim() || inputTitle.length === 0) {
        Alert.alert("Title is required");
        setLoading(false);
        return;
    }



    if (inputStartTime >= inputEndTime) {
        Alert.alert("End time must be later than start time");
        setLoading(false);
        return;
    }
    
    setLoading(true);
    onSubmitHandler()


}

  const onSubmitHandler = () => {
    insertWorkout({inputTitle, inputNotes, inputDate, inputStartTime, inputEndTime, user_id, inviteBuddyList},
      {
        onSuccess: async () => {
          resetFields();
          for (let buddy of inviteBuddyList)
          {
            await notifyUserAboutNewInvite(buddy.id)
          }


          navigation.navigate('Tabs');
        },
        onError: (error) => {
          Alert.alert('Error', error.message );
          setLoading(false);
        },
      });  
  };


  const handleBuddyInviteList = (buddy) => {
      setInviteBuddyList(buddy)
      
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <KeyboardAvoidingView style={styles.container}>

        <View style={styles.inputArea}>
          <Text style={styles.label}>Title:</Text>
          <TextInput
              style={[styles.inputBox, {height:textHeight, maxHeight:200}]}
              placeholder={'(Required) Add a title ex. Walk'}
              keyboardType="default"
              value={inputTitle}
              onChangeText={setInputTitle}
              multiline
              onContentSizeChange={e => setTextHeight(e.nativeEvent.contentSize.height)}
          />
        </View>
        <View style={styles.inputArea}>
          <Text style={styles.label}>Date:</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.inputBox}>
          <Text >{inputDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

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
        <TouchableOpacity onPress={showStartpicker} style={styles.inputBoxSmall}>
          <Text >{formatTime(inputStartTime)}</Text>

        </TouchableOpacity>

        {openStart && (
          <DateTimePicker
            testID="dateTimePicker"
            value={inputStartTime}
            mode="time"
            display="spinner"
            // minuteInterval={15}
            onChange={onChangeStart}
          />
        )}

        <Text style={styles.labelSmall}>End:</Text>
        <TouchableOpacity onPress={showEndpicker} style={styles.inputBoxSmall}>
          <Text >{formatTime(inputEndTime)}</Text>

        </TouchableOpacity>
        {openEnd && (
          <DateTimePicker
            testID="dateTimePicker"
            value={inputEndTime}
            mode="time"
            display="spinner"
            // minuteInterval={15}
            onChange={onChangeEnd}
          />
        )}

        </View>

        <View style={styles.inputArea}>
        <Text style={styles.label}>Notes:</Text>
        <TextInput 
        style={[styles.inputBox, {height:noteHeight}]} 
        placeholder={'(Optional) Add Notes'}
        keyboardType="default"
        value={inputNotes}
        multiline
        onContentSizeChange={e => setNoteHeight(e.nativeEvent.contentSize.height)}
        onChangeText={setInputNotes}
         />

        </View>
      </KeyboardAvoidingView>
      <InternalWorkoutBuddiesList buddies={buddies} forNew={true} OnAddBuddyToInvites ={handleBuddyInviteList} allParticipants={[]} allInvitations={[]} workout={null} participantState={'new'}/>
      <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={validateFields} disabled={loading} style={styles.button}>
                <Text style={styles.buttonText}>{loading ? 'Creating Workout...' : 'Create Workout'} </Text>
            </TouchableOpacity>
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
    gap: 10,
    flex: 1

  },

  inputBoxBig: {
    height: 100,
    borderColor: 'lightgray',
    backgroundColor: 'white',
    borderWidth: 2,
    marginBottom: 15,
    paddingHorizontal: 10,
    flex: 6,
  },

  inputBox: {
    minHeight: 40, 
    height: 40,
    borderColor: 'lightgray',
    backgroundColor: 'white',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    flex: 6,
  },

  labelSmall: {
    fontSize: 20,
    color: '#3D3D3D',
    fontFamily: 'fantasy',
    flex: 3
  },

  inputBoxSmall: {
    height: 40,
    borderColor: 'lightgray',
    backgroundColor: 'white',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 5,
  },


});

export default NewWorkoutScreen;