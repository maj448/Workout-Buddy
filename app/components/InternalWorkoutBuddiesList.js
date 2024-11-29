import { View, Text, Pressable, StyleSheet, TouchableOpacity} from "react-native"
import InternalWorkoutBuddyListItem from "./InternalWorkoutBuddyListItem";
import React, {useEffect, useState} from 'react';
import { MultiSelect } from 'react-native-element-dropdown';
import { useInviteToWorkout } from "../api/workouts";




export default function InternalWorkoutBuddiesList({buddies, forNew, OnAddBuddyToInvites, allParticipants, allInvitations, workout, participantState}){


  const [isFocus, setIsFocus] = useState(false);
  const [dropdownData, setDropdownData] = useState([])
  const [selected, setSelected] = useState([])
  const [workoutStatus, setWorkoutStatus] = useState('new')


  const {mutate: inviteToWorkout} = useInviteToWorkout();

  useEffect(() => {
    if(workout)
      setWorkoutStatus(workout.workout_status)

    if(buddies){
      const newDropdownData = buddies.map(buddy => ({
        label: buddy.username, 
        value: buddy        
      }));

      setDropdownData(newDropdownData)
    }

    if (selected.length > 0) {
      OnAddBuddyToInvites(selected)
    }
  }, [selected, buddies]);

  const checkNewInvites = () => {

    const alreadyInWorkout = [
      ...allParticipants.map(item => item.profiles.id),
      ...allInvitations.map(item => item.profiles.id)
    ];
  
    return selected.filter(item => !alreadyInWorkout.includes(item.id));
      
  }
  const selectBoxFlex = forNew ? {flex : 1 } : {flex : 6};

  const sendInvites = () => {
      let workout_id = workout.id
      let newInvites = checkNewInvites();
      inviteToWorkout({selected : newInvites, workout_id})
      setSelected([])
  }

    return(
    <View style={styles.container}>

      { participantState != 'complete' && 
      <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24, }}>Buddies:</Text>
      }

      { participantState == 'complete' &&
      <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24, }}>Completed with Buddies:</Text>
      }

      { participantState != 'complete' && workoutStatus != 'past' && participantState &&
      <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10}}>

        <View style={[selectBoxFlex]}>
        <MultiSelect
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={dropdownData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select Buddies' : '...'}
          searchPlaceholder="Search..."
          value= {selected}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setSelected(item);
            setIsFocus(false);
          }}
          selectedStyle={styles.selectedStyle}
        />
        </View>


        {!forNew && 
          <TouchableOpacity onPress={sendInvites} style={styles.button}>
            <Text style={styles.buttonText}>Invite</Text> 
          </TouchableOpacity>}
      </View>

       
      }
      <View style={styles.listGap}>


        {allInvitations && allInvitations.map((buddie) => (
          <InternalWorkoutBuddyListItem key={buddie.id} buddie={buddie} forNew={forNew}/>
        ))}
        {allParticipants && allParticipants.map((buddie) => (
          <InternalWorkoutBuddyListItem key={buddie.id} buddie={buddie} forNew={forNew}/>
        ))}


      </View>



        
    </View>
    );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray', 
    padding: 10, 
    gap: 10,
    borderRadius: 10
  },

  dropdown: {
    height: 50,
    borderColor: 'gray',
    backgroundColor: 'lightgray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 20,
  },

  icon: {
    marginRight: 5,
  },

  // label: {
  //   position: 'absolute',
  //   backgroundColor: '#DDF8D6',
  //   left: 22,
  //   top: 8,
  //   zIndex: 999,
  //   paddingHorizontal: 8,
  //   fontSize: 14,
  // },

  placeholderStyle: {
    fontSize: 16,
  },

  selectedTextStyle: {
    fontSize: 16,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  selectedStyle: {
    borderRadius: 12,
    backgroundColor: '#DDF8D6'
  },

  button: {
    width: 100,
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 10,
    flex: 2

  },

  buttonText : {
    fontSize: 16,
    color: '#3D3D3D',
    fontFamily: 'fantasy'
  },

  buttonContainer : {
    flex:3, 
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  
  listGap: {
    gap: 5
  }


});

