import { View, Text, FlatList, TouchableOpacity, Pressable } from "react-native"
import WorkoutBuddyListItem from "./WorkoutBuddyListItem";
import React, {useState} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';



export default function WorkoutBuddiesList({buddies}){


  const navigation = useNavigation();


    const inviteFriend = () => {
      navigation.navigate("Add Buddy")

    };
    return(
    <View style={{backgroundColor: '#6EEB92', padding: 10, gap: 10, flex: 2}}>
      <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10}}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 40}}>Buddies</Text>
        <TouchableOpacity onPress={inviteFriend}>
          <Ionicons name="add-circle-outline" size={40} color="white" />
        </TouchableOpacity>
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