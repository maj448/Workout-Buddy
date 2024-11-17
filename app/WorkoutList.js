import { View, Text, FlatList, TextInput, Button } from "react-native"
import WorkoutListItem from "./WorkoutListItem";
import React, {useState} from 'react';



export default function WorkoutList({tasks}){


    const [newTask, setNewTask] = useState('')

    const createTask = () => {

    };
    return(
    <View style={{backgroundColor: '#101112', padding: 10, gap: 10}}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Workout Tasks</Text>


        <FlatList
        data={tasks}
        contentContainerStyle={{ gap: 5 }}
        renderItem={({ item }) => (
          <WorkoutListItem task={item} />
        )}
      />

        <TextInput
            placeholder="New task"
            placeholderTextColor='gray'
            style={{color: 'white', backgroundColor: 'black', padding: 10}}/>

        <Button title="Add task" onPress={createTask}/>
        
    </View>
    );
}