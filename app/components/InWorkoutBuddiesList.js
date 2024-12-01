//This file has the list area for buddies within a started workout
import { View, Text, StyleSheet, FlatList} from "react-native"
import InWorkoutBuddyListItem from "./InWorkoutBuddyListItem";



export default function InWorkoutBuddiesList({allParticipants}){

    return(
    <View style={styles.sectionStyle}>

      <Text style={styles.label}>Buddies:</Text>

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
    width: '100%'
  },

  container: {
    backgroundColor: 'white',

  },

  label: {
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 30, 
    padding: 10
  },



});

