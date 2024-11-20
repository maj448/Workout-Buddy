
import {SafeAreaView} from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, ScrollView, Button } from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { format, parseISO} from 'date-fns';
import WorkoutList from "./WorkoutList"
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './providers/AuthProvider';
import { participantWorkouts, participantWorkoutsDetails } from './api/workouts';
import { ActivityIndicator } from 'react-native';



const workoutStatuses = {
  pending: { key: 'pending', color: 'blue' },
  completed: { key: 'complete', color: 'green' },
  upcoming: { key: 'upcoming', color: 'orange' },
  missed: { key: 'missed', color: 'red' },
};


export default function Index() {
  const { session } = useAuth();
  const navigation = useNavigation();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selected, setSelected] = useState(today);
  const [filteredWorkouts, setFilteredWorkouts] = useState([])
  const [markedDates, setMarkedDates] = useState({});

  const { data: participants, isLoading: isParticipantsLoading, error: participantsError } = participantWorkouts(session?.user.id)

  const { data: workouts, isLoading: isWorkoutsLoading, error: workoutsError} = participantWorkoutsDetails(participants)


  useEffect(() => {
    if (workouts) {
      const newMarkedDates = {};
      workouts.forEach((workout) => {
        const workoutDate = workout.workout_date.split('T')[0]; // Extract date (YYYY-MM-DD)

        // Initialize the date entry if it doesn't exist yet
        if (!newMarkedDates[workoutDate]) {
          newMarkedDates[workoutDate] = { dots: [] };
        }

        const dotKey = `${workout.id}-${workout.workout_status}`;
        // Add a dot for the workout based on its status
        newMarkedDates[workoutDate].dots.push({
          key: dotKey, 
          color: workoutStatuses[workout.workout_status]?.color,
        });
      });

      setMarkedDates(newMarkedDates);

      const filtered = workouts.filter((workout) => {
        const workoutDate = workout.workout_date.split('T')[0];
        return workoutDate === selected;
      });

      setFilteredWorkouts(filtered);
    
  }
}, [workouts, selected]);

  if (isParticipantsLoading || isWorkoutsLoading) {
    return <ActivityIndicator />;
  }

  if (participantsError || workoutsError) {
    return console.error(participantsError || workoutsError);
    
  }




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

    <WorkoutList workouts={filteredWorkouts} displayDate ={displayDate} selected={selected}/>

    </SafeAreaView>
    );
  }