
import {SafeAreaView} from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, ScrollView, Button } from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { format, parseISO} from 'date-fns';
import WorkoutList from "./WorkoutList"
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useState, useEffect, useCallback } from 'react'
import { supabase } from './utils/supabase';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './providers/AuthProvider';
import { participantWorkoutsTest } from './api/workouts';
import { ActivityIndicator } from 'react-native';
import {  Gesture, GestureDetector, Directions, GestureHandlerRootView } from 'react-native-gesture-handler';
import moment from 'moment'

const workoutStatuses = {
  pending: { key: 'pending', color: 'blue' },
  completed: { key: 'complete', color: 'green' },
  upcoming: { key: 'upcoming', color: 'orange' },
  missed: { key: 'missed', color: 'red' },
};


export default function Index() {
  const { session } = useAuth();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selected, setSelected] = useState(today);
  const [filteredWorkouts, setFilteredWorkouts] = useState([])
  const [markedDates, setMarkedDates] = useState({});
  const [participantWorkoutsIds, setParticipantWorkoutsIds] = useState<any>()

  const { data: workouts, isLoading: isWorkoutsLoading, error: workoutsError} = participantWorkoutsTest(session?.user.id)
  
  const subtractDay = () => {
    const subDay = moment(selected).add(-1, 'day').toISOString()
    setSelected(subDay.split('T')[0])
  };
  
  const flingGestureRight = Gesture.Fling()
  .direction(Directions.RIGHT)
  .onEnd(subtractDay)
  .runOnJS(true)
  ;

  const addDay = () => {
    const plusDay = moment(selected).add(1, 'day').toISOString()
    setSelected(plusDay.split('T')[0])
  };
  
  const flingGestureLeft = Gesture.Fling()
  .direction(Directions.LEFT)
  .onEnd(addDay)
  .runOnJS(true)
  ;

  const combinedGesture = Gesture.Race(flingGestureLeft, flingGestureRight);


  useEffect(() => {
    if (workouts || workouts == '') {
      const newMarkedDates = {};
      workouts.forEach((workout) => {
        const workoutDate = workout.workout_date.split('T')[0];

        if (!newMarkedDates[workoutDate]) {
          newMarkedDates[workoutDate] = { dots: [] };
        }

        const dotKey = `${workout.id}-${workout.workout_status}`;
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

  if ( isWorkoutsLoading) {
    return <ActivityIndicator />;
  }

  if ( workoutsError) {
    return console.error(workoutsError);
    
  }




  const createWorkout = (day) => {

    if(day >= today){
      navigation.navigate('New Workout', {selected: day})
    }
    else
    {
      return [];
    }
    

  };


  
  const displayDate = format(parseISO(selected), 'MMM dd');

    return (
      <SafeAreaView style= {{flex:1}}>

        <Calendar
          onDayPress={day => {
            setSelected(day.dateString);
          }}
          onDayLongPress={day => {
            setSelected(day.dateString);

            createWorkout(day.dateString);
            }}
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
    <GestureDetector gesture={combinedGesture} >
    {/* <View collapsable={false}> */}
    <WorkoutList workouts={filteredWorkouts} displayDate ={displayDate} selected={selected}/>
    {/* </View> */}
    </GestureDetector>
    </SafeAreaView>
    );
  }