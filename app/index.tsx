
import {SafeAreaView} from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, ScrollView, Button } from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { format, parseISO} from 'date-fns';
import WorkoutList from "./WorkoutList"
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase';
import { useQuery } from '@tanstack/react-query';

// enum WorkoutStatus {
//   Upcoming = 'upcoming',
//   Pending = 'pending',
//   Complete = 'complete',
//   Missed = 'missed',
// }

// const workoutStatuses = {
//   [WorkoutStatus.Upcoming]: { key: 'upcoming', color: 'orange' },
//   [WorkoutStatus.Pending]: { key: 'pending', color: 'blue' },
//   [WorkoutStatus.Complete]: { key: 'complete', color: 'green' },
//   [WorkoutStatus.Missed]: { key: 'missed', color: 'red' },
// };

const workoutStatuses = {
  pending: {
    key: 'pending', color: 'blue' , 
  },
  completed: {
    key: 'complete', color: 'green', 
  },
  upcoming: {
    key: 'upcoming', color: 'orange', 
  },
  missed: {
    key: 'missed', color: 'red', 
  },
};


export default function Index() {

  const {data : tasks, error, isLoading} = useQuery({
    queryKey : ['workouts'],
    queryFn: async () => {
      const {data, error} = 
      await supabase.from('workouts').select('*');


      if(error){
        throw new Error(error.message)
      };
      return data;
    },
  })
  const navigation = useNavigation();


  const today = format(new Date(), 'yyyy-MM-dd');
  //const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(today);

  //const markedDates: { [key: string]: { dots: { key: string, color: string }[] } } = {};
  const [filteredTasks, setFilteredTasks] = useState([])
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    if (tasks) {
      const newMarkedDates = {};
      tasks.forEach((task) => {
        const taskDate = task.workout_date.split('T')[0]; // Extract date (YYYY-MM-DD)

        // Initialize the date entry if it doesn't exist yet
        if (!newMarkedDates[taskDate]) {
          newMarkedDates[taskDate] = { dots: [] };
        }

        // Add a dot for the task based on its status
        newMarkedDates[taskDate].dots.push({
          key: workoutStatuses[task.workout_status]?.key,
          color: workoutStatuses[task.workout_status]?.color,
        });
      });

      setMarkedDates(newMarkedDates);

      const filtered = tasks.filter((task) => {
        const taskDate = task.workout_date.split('T')[0];
        return taskDate === selected;
      });

      setFilteredTasks(filtered);
    
  }
}, [tasks, selected]);

const createWorkout = (day) => {
  setSelected(day.dateString);
  navigation.navigate('New Workout', {selected: selected})

};


  
  const displayDate = format(parseISO(selected), 'MMM dd');

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

    </SafeAreaView>
    );
  }