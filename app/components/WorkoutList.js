import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native"
import WorkoutListItem from "./WorkoutListItem";
import React, {useState} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import InvitedWorkoutListItem from './InvitedWorkoutListItem';
import { format} from 'date-fns';



export default function WorkoutList({workouts, invitedWorkouts, displayDate, selected}){



  const navigation = useNavigation();
  const today = format(new Date(), 'yyyy-MM-dd');

  const createWorkout = () => {
    navigation.navigate('New Workout', {selected});

  };

  if((workouts.length=== 0 ) && ( invitedWorkouts.length=== 0 )){
    return (
      <View style={{backgroundColor: '#6EEB92', padding: 10, gap: 10, flex: 1}} collapsable={false}>
        <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10}}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 30}}>{displayDate}</Text>
          { today <= selected &&
          <TouchableOpacity onPress={createWorkout}>
            <Ionicons name="add-circle-outline" size={35} color="white" />
          </TouchableOpacity>
          }
        </View>
        <Text style={styles.text}> No workouts scheduled</Text>
      </View>
    )
  }




  const showInvitedWorkouts = () => {

    return (
      <FlatList
        data={invitedWorkouts}
        contentContainerStyle={{ gap: 5 }}
        renderItem={({ item }) => (
          <InvitedWorkoutListItem workout={item}/>
        )}
      />
    );

  }

  return(
  <View style={{backgroundColor: '#6EEB92', padding: 10, gap: 10, flex: 1}} collapsable={false}>
    <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10}}>
      <Text style={{color: 'white', fontWeight: 'bold', fontSize: 30}}>{displayDate}</Text>
      { today <= selected &&
      <TouchableOpacity onPress={createWorkout}>
        <Ionicons name="add-circle-outline" size={35} color="white" />
      </TouchableOpacity>
      }
    </View>

      <FlatList
      data={workouts}
      ListHeaderComponent={showInvitedWorkouts}
      contentContainerStyle={{ gap: 5 }}
      renderItem={({ item }) => (
        <WorkoutListItem workout={item}/>
      )}
    />

      
      
  </View> 
  );
}

const styles = StyleSheet.create({
  text: {
      color: 'white',
      fontSize: 22,
      textAlign: 'center',
      padding: 20
  },
})