import { View, Text, FlatList, TextInput, Button, Pressable } from "react-native"
import WorkoutListItem from "./WorkoutListItem";
import React, {useState} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import InvitedWorkoutListItem from './InvitedWorkoutListItem'



export default function WorkoutList({workouts, invitedWorkouts, displayDate, selected}){

  const navigation = useNavigation();

    const [newWorkout, setNewWorkout] = useState('')

    const createWorkout = () => {
      navigation.navigate('New Workout', {selected});

    };

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
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>{displayDate}</Text>
        <Pressable onPress={createWorkout}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
        </Pressable>
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