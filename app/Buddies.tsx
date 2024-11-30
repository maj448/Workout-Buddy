
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

  const {data: buddies, isLoading : isLoadingBuddies} = userBuddies(session?.user.id);

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
  const flingGestureDown = Gesture.Fling()
  .direction(Directions.DOWN)
  .onEnd(refresh)
  .runOnJS(true)
  ;
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