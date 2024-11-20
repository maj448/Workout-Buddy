import { View, Text, FlatList, TextInput, Button, Pressable } from "react-native"
import WorkoutListItem from "./WorkoutListItem";
import React, {useState} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
//import { useNavigation } from '@react-navigation/native';



export default function WorkoutList({workouts, displayDate, selected}){

  //const navigation = useNavigation();

    const [newWorkout, setNewWorkout] = useState('')

    const createWorkout = () => {
      navigation.navigate('New Workout', {selected});

    };
    return(
    <View style={{backgroundColor: '#6EEB92', padding: 10, gap: 10, flex: 1}}>
      <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10}}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>{displayDate}</Text>
        <Pressable onPress={createWorkout}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
        </Pressable>
      </View>

        <FlatList
        data={workouts}
        contentContainerStyle={{ gap: 5 }}
        renderItem={({ item }) => (
          <WorkoutListItem workout={item} />
        )}
      />

       
        
    </View>
    );
}