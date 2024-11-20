import { View, Text, StyleSheet, Button } from 'react-native';
import { format, parseISO} from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import WorkoutBuddiesList from './WorkoutBuddiesList'

const WorkoutDetailsScreen = ({route}) => {
    // if (!workout) {
    //     console.error("workout is undefined", workout);
    //     return null;  
    //   }

    const { workout} = route.params;
    const displayStartTime = format(parseISO(workout.start_time), 'h:mm a')
    const displayEndTime = format(parseISO(workout.end_time), 'h:mm a')
    const displayDate = format(parseISO(workout.workout_date), 'yyyy-mm-dd')
    const navigation = useNavigation()

    const gotoInWorkout = () => {
      navigation.navigate('In Workout');
    };
    const gotoExample = () => {
      navigation.navigate('Example');
    };

  return (
    <View style={styles.container}>
      <Text style= {styles.text}>Title: {workout.title}</Text>
      <Text style= {styles.text}>Date: {displayDate}</Text>
      <Text style= {styles.text}>Start: {displayStartTime}</Text>
      <Text style= {styles.text}>End: {displayEndTime}</Text>
      <Text style= {styles.text}>Notes: {workout.notes}</Text>
      <Text>Duration:</Text>
      <Text>Activity:</Text>
    

      <WorkoutBuddiesList/>
      <View>
        <Button title= 'Check In' onPress={gotoExample}/>
        <Button title= 'leave'/>
      </View>
      <Button title= 'Start' onPress={gotoInWorkout}/>
      <View>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 16,
},
});

export default WorkoutDetailsScreen;