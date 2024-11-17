import { View, Text, FlatList, TextInput, Button, Pressable } from "react-native"
import WorkoutListItem from "./WorkoutListItem";
import React, {useState} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';



export default function WorkoutList({tasks, displayDate}){


    const [newTask, setNewTask] = useState('')

    const createTask = () => {
      alert('got here');

    };
    return(
    <View style={{backgroundColor: 'lime', padding: 10, gap: 10, flex: 1}}>
      <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>{displayDate}</Text>
        <Pressable onPress={createTask}>
          <Ionicons name="add-circle-outline" size={24} color="black" />
        </Pressable>
      </View>

        <FlatList
        data={tasks}
        contentContainerStyle={{ gap: 5 }}
        renderItem={({ item }) => (
          <WorkoutListItem task={item} />
        )}
      />

       
        
    </View>
    );
}