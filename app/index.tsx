
import {SafeAreaView} from 'react-native-safe-area-context';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { format, parseISO} from 'date-fns';
import WorkoutList from "./components/WorkoutList"
import {  useNavigation } from '@react-navigation/native';
import { useState, useEffect} from 'react'
import { useAuth } from './providers/AuthProvider';
import { participantWorkouts, invitedWorkouts, updateOldWorkouts} from './api/workouts';
import { ActivityIndicator } from 'react-native';
import {  Gesture, GestureDetector, Directions} from 'react-native-gesture-handler';
import moment from 'moment'
import { useInviteSubscription } from './api/subscriptions';
import { useQueryClient } from '@tanstack/react-query';

const workoutStatuses = {
  pending: { key: 'pending', color: 'blue' },
  past: { key: 'past', color: 'gray' },
  complete: { key: 'complete', color: 'limegreen' },
  upcoming: { key: 'upcoming', color: 'orange' },
};


export default function Index() {
  const { session } = useAuth();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const today = format(new Date(), 'yyyy-MM-dd');
  const [selected, setSelected] = useState(today);
  const [filteredWorkouts, setFilteredWorkouts] = useState([])
  const [filteredInvites, setFilteredInvites] = useState([])
  const [markedDates, setMarkedDates] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {data: updatedOld} = updateOldWorkouts()
  const { data: workoutsWithParticipation, isLoading: isWorkoutsLoading, error: workoutsError} = participantWorkouts(session?.user.id)
  const { data: invited, isLoading: isInvitedLoading, error: invitedError} = invitedWorkouts(session?.user.id)

  
  useInviteSubscription(session?.user.id);
  
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

  const refresh = () => {
    setIsRefreshing(true);

    queryClient.invalidateQueries(['invitations', session?.user.id])
    .then(() => {setIsRefreshing(false);  })
    .catch((error) => {
      console.error("Error invalidating queries", error);
      setIsRefreshing(false);
    });

  }
  const flingGestureDown = Gesture.Fling()
  .direction(Directions.DOWN)
  .onEnd(refresh)
  .runOnJS(true)
  ;
  const combinedGesture = Gesture.Race(flingGestureLeft, flingGestureRight);


  useEffect(() => {
    const newMarkedDates = {};

    if (workoutsWithParticipation || workoutsWithParticipation == '') {
      
      workoutsWithParticipation.forEach((workout) => {
        let colorValue

        const workoutDate = workout.workouts.workout_date.split('T')[0];

        if (!newMarkedDates[workoutDate]) {
          newMarkedDates[workoutDate] = { dots: [] };
        }

        const dotKey = `${workout.workouts.id}-${workout.workouts.workout_status}`;

        if (workout.status == 'complete')
          colorValue = workoutStatuses['complete']?.color
        else
          colorValue = workoutStatuses[workout.workouts.workout_status]?.color
        newMarkedDates[workoutDate].dots.push({
          key: dotKey, 
          color: colorValue,
        });
      });

      if(invited || invited == '')
      {
        invited.forEach((invite) => {
          const workoutDate = invite.workout_date.split('T')[0];
  
          if (!newMarkedDates[workoutDate]) {
            newMarkedDates[workoutDate] = { dots: [] };
          }
  
          const dotKey = `${invite.id}-${'pending'}`;
          newMarkedDates[workoutDate].dots.push({
            key: dotKey, 
            color: workoutStatuses['pending']?.color,
          });
        });



        const fInvites = invited.filter((invite) => {
          let convertToLocal = format(new Date(invite.workout_date), 'yyyy-MM-dd')
          const workoutDate = convertToLocal.toLocaleString().split('T')[0];
          return workoutDate === selected;
        });

        setFilteredInvites(fInvites);

      }

      setMarkedDates(newMarkedDates);

      const filtered = workoutsWithParticipation.filter((workout) => {
        let convertToLocal = format(new Date(workout.workouts.workout_date), 'yyyy-MM-dd')
        const workoutDate = convertToLocal.toLocaleString().split('T')[0];
        return workoutDate === selected;
      });



      setFilteredWorkouts(filtered);
    
  }
}, [workoutsWithParticipation, invited, selected, updatedOld]);

  if ( isWorkoutsLoading || isInvitedLoading || isRefreshing) {
    return <ActivityIndicator />;
  }

  if ( workoutsError || invitedError) {
    return console.error(workoutsError || invitedError);
    
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
    <GestureDetector gesture={flingGestureDown}>
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
        <WorkoutList workouts={filteredWorkouts} invitedWorkouts={filteredInvites} displayDate ={displayDate} selected={selected}/>
      </GestureDetector>
    </SafeAreaView>
    </GestureDetector>
  );
}

