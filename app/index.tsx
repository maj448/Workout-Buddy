
import {SafeAreaView} from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, ScrollView, Button } from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { format, parseISO} from 'date-fns';
import WorkoutList from "./WorkoutList"
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase';
import Day from 'react-native-calendars/src/calendar/day';
import { Session } from '@supabase/supabase-js'

enum WorkoutStatus {
  Upcoming = 'upcoming',
  Pending = 'pending',
  Complete = 'complete',
  Missed = 'missed',
}

const workoutStatuses = {
  [WorkoutStatus.Upcoming]: { key: 'upcoming', color: 'orange' },
  [WorkoutStatus.Pending]: { key: 'pending', color: 'blue' },
  [WorkoutStatus.Complete]: { key: 'complete', color: 'green' },
  [WorkoutStatus.Missed]: { key: 'missed', color: 'red' },
};

type Task = {
  id: number;
  title: string;
  notes: string;
  workout_date: string;
  status: WorkoutStatus;
  start_time: string;
  end_time: string;
};

type Props = {
  task: Task;
};

export default function Index() {
  
  const navigation = useNavigation();

  
  const [users, setUsers] = useState([
    { 
      id: 1, 
      username: 'Alice', 
      email: 'alice@example.com', 
      password_hash: 'hashed_password_1' 
    },
    { 
      id: 2, 
      username: 'Bob', 
      email: 'bob@example.com', 
      password_hash: 'hashed_password_2' 
    },
    { 
      id: 3, 
      username: 'Charlie', 
      email: 'charlie@example.com', 
      password_hash: 'hashed_password_3' 
    },
    { 
      id: 4, 
      username: 'David', 
      email: 'david@example.com', 
      password_hash: 'hashed_password_4' 
    },
    { 
      id: 5, 
      username: 'Eve', 
      email: 'eve@example.com', 
      password_hash: 'hashed_password_5' 
    }
  ]);
  
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Morning Run', 
      notes: 'A 5km run around the park.', 
      workout_date: '2024-11-17T07:00:00Z', 
      start_time: '2024-11-17T07:00:00Z',
      end_time: '2024-11-17T08:00:00Z',
      status: WorkoutStatus.Upcoming
    },
    { 
      id: 2,
      title: 'Yoga Session', 
      notes: 'Morning yoga for flexibility.', 
      workout_date: '2024-11-18T08:00:00Z',  
      start_time: '2024-11-18T08:00:00Z',
      end_time: '2024-11-18T09:00:00Z',
      status: WorkoutStatus.Pending,
    },
    { 
      id: 3, 
      title: 'Evening Cycling', 
      notes: 'A scenic cycling route around the lake.', 
      workout_date: '2024-11-17T18:00:00Z',
      start_time: '2024-11-17T18:00:00Z',
      end_time: '2024-11-17T19:30:00Z',
      status: WorkoutStatus.Complete,
    }
  ]);

  const [invitations, setInvitations] = useState([
    { 
      id: 1, 
      workout_id: 1, 
      inviter_id: 1, 
      invitee_id: 2, 
      status: 'pending' 
    },  

    { 
      id: 2, 
      workout_id: 1, 
      inviter_id: 1, 
      invitee_id: 3, 
      status: 'accepted' 
    },  
    { 
      id: 3, 
      workout_id: 2, 
      inviter_id: 2, 
      invitee_id: 3, 
      status: 'pending' 
    },  
    { 
      id: 4, 
      workout_id: 3, 
      inviter_id: 3, 
      invitee_id: 4, 
      status: 'pending' 
    },  
    { 
      id: 5, 
      workout_id: 3, 
      inviter_id: 3, 
      invitee_id: 5, 
      status: 'accepted' 
    }   
  ]);

  const [buddies, setBuddies] = useState([
    { 
      id: 1, 
      user_id: 1, 
      friend_id: 2, 
      status: 'accepted' },  
    { 
      id: 2, 
      user_id: 1, 
      friend_id: 3, 
      status: 'accepted' },  
    { 
      id: 3, 
      user_id: 2, 
      friend_id: 3, 
      status: 'pending' },   
    { 
      id: 4, 
      user_id: 4, 
      friend_id: 5, 
      status: 'pending' }   
  ]);



  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  const [modalVisible, setModalVisible] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');
  //const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(today);

  const markedDates: { [key: string]: { dots: { key: string, color: string }[] } } = {};

  tasks.forEach((task) => {
  const taskDate = task.workout_date.split('T')[0]; // Extract date (YYYY-MM-DD)

  // Initialize the date entry if it doesn't exist yet
  if (!markedDates[taskDate]) {
    markedDates[taskDate] = { dots: [] };
  }

  // Add a dot for the task based on its status
  markedDates[taskDate].dots.push({
    key: workoutStatuses[task.status].key,
    color: workoutStatuses[task.status].color,
  });
});

const createWorkout = (day) => {
  setSelected(day.dateString);
  navigation.navigate('New Workout', {selected})

};

  const filteredTasks = tasks.filter(task => {
    const taskDate = task.workout_date.split('T')[0];
    return taskDate === selected;
  });
  
  const displayDate = format(parseISO(selected), 'MMM dd');

  const gotoTestStackScreen = () => {
		navigation.navigate('New Workout', {selected});
	};

 
    return (
      <SafeAreaView style= {{flex:1}}>

        <Calendar
          onDayPress={day => {
            setSelected(day.dateString);
          }}
          onDayLongPress={createWorkout}
          markingType="multi-dot"
          markedDates={{
            ...markedDates,
            [selected]: {
              selected: true, 
              disableTouchEvent: true, 
              selectedColor: '#6EEB92'}
          }}
          enableSwipeMonths={true}

        />

    <WorkoutList workouts={filteredTasks} displayDate ={displayDate} selected={selected}/>
    {/* <Button title="Go to test stack screen" onPress={gotoTestStackScreen} /> */}
    </SafeAreaView>
    );
  }