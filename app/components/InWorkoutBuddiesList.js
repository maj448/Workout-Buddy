import { View, Text, StyleSheet, FlatList} from "react-native"
import InWorkoutBuddyListItem from "./InWorkoutBuddyListItem";
import React, {useEffect, useState} from 'react';





export default function InWorkoutBuddiesList({allParticipants}){






    return(
    <View style={styles.sectionStyle}>

      <Text style={styles.label}>Buddies:</Text>

{/* 
        {allParticipants && allParticipants.map((buddie) => (
          <InWorkoutBuddyListItem key={buddie.id} buddie={buddie}/>
        ))} */}

    <FlatList
      data={allParticipants}
      renderItem={({ item }) => <InWorkoutBuddyListItem buddie={item} />}
      contentContainerStyle={{flexDirection: 'row'}}
    />

        
    </View>
    );
}



const styles = StyleSheet.create({
  sectionStyle : {
    backgroundColor: 'black', 
    flex: 3 ,
    //gap: 10, 
    width: '100%'
  },
  container: {
    backgroundColor: 'white',
    //padding: 16,
  },


  label: {
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 30, 
    padding: 10
  },



});

