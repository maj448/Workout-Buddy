import { View, Text, FlatList, TextInput, Button, Pressable } from "react-native"
import WorkoutBuddyListItem from "./WorkoutBuddyListItem";
import React, {useState} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
//import { useNavigation } from '@react-navigation/native';



export default function WorkoutBuddiesList({buddies}){

  //const navigation = useNavigation();


    const inviteFriend = () => {
      //make a module to pop up

    };
    return(
    <View style={{backgroundColor: '#6EEB92', padding: 10, gap: 10, flex: 1}}>
      <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10}}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>Buddies</Text>
        <Pressable onPress={inviteFriend}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
        </Pressable>
      </View>

        <FlatList
        data={buddies}
        contentContainerStyle={{ gap: 5 }}
        renderItem={({ item }) => (
          <WorkoutBuddyListItem buddie={item} />
        )}
      />

       
        
    </View>
    );
}