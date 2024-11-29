
import {SafeAreaView} from 'react-native-safe-area-context';
import { useAuth } from './providers/AuthProvider';
import WorkoutBuddiesList from './components/WorkoutBuddiesList';
import { userBuddies } from './api/buddies';
import { ActivityIndicator } from 'react-native';


export default function Buddy() {

  const { session } = useAuth();

  const {data: buddies, isLoading : isLoadingBuddies} = userBuddies(session?.user.id);


  if (isLoadingBuddies) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
    <WorkoutBuddiesList buddies={buddies}/>
    </SafeAreaView>
  );
}