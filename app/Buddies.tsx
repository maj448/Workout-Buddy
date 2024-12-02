//this is the screen to view or delete user buddies
import {SafeAreaView} from 'react-native-safe-area-context';
import { useAuth } from './providers/AuthProvider';
import WorkoutBuddiesList from './components/WorkoutBuddiesList';
import { userBuddies } from './api/buddies';
import { ActivityIndicator } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import {  Gesture, GestureDetector, Directions} from 'react-native-gesture-handler';
import { useState } from 'react';


export default function Buddy() {

  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  //get all user buddies profiles 
  const {data: buddies, isLoading : isLoadingBuddies} = userBuddies(session?.user.id);

  //This function reloads the users buddies from the database
  const refresh = () => {
    setIsRefreshing(true);

    queryClient.invalidateQueries(['buddies', session?.user.id])
    .then(() => {
      setIsRefreshing(false);
    })
    .catch((error) => {
      console.error("Error invalidating queries", error);
      setIsRefreshing(false);
    });
  }

  //on a fling down reload the buddies
  const flingGestureDown = Gesture.Fling()
  .direction(Directions.DOWN)
  .onEnd(refresh)
  .runOnJS(true)
  ;
  
  //show an idicator if the dtatbase queries are loading
  if (isLoadingBuddies || isRefreshing) {
    return <ActivityIndicator />;
  }

  return (
    <GestureDetector gesture={flingGestureDown}>
    <SafeAreaView style={{flex: 1}}>
    <WorkoutBuddiesList buddies={buddies}/>
    </SafeAreaView>
    </GestureDetector>
  );
}