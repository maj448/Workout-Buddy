//This file contains the list container for listing buddies inside the new workout and workout details screens
import { View, Text, StyleSheet, TouchableOpacity} from "react-native"
import InternalWorkoutBuddyListItem from "./InternalWorkoutBuddyListItem";
import React, {useEffect, useState} from 'react';
import { MultiSelect } from 'react-native-element-dropdown';
import { useInviteToWorkout } from "../api/workouts";
import { notifyUserAboutNewInvite } from "../utils/notifications";
import AntDesign from '@expo/vector-icons/AntDesign';




export default function InternalWorkoutBuddiesList({buddies, forNew, OnAddBuddyToInvites, allParticipants, allInvitations, workout, participantState}){


  const [isFocus, setIsFocus] = useState(false);
  const [dropdownData, setDropdownData] = useState([])
  const [selected, setSelected] = useState([])
  const [workoutStatus, setWorkoutStatus] = useState('new')

  //get the database function to invite a buddy to a workout
  const {mutate: inviteToWorkout} = useInviteToWorkout();

  useEffect(() => {
    if(workout)
      setWorkoutStatus(workout.workout_status)

    //put all buddies in a format that can be used by a multiselcet dropdown box
    if(buddies){
      const newDropdownData = buddies.map(buddy => ({
        label: buddy.username, 
        value: buddy        
      }));

      setDropdownData(newDropdownData)
    }

    //send the selected buddies back to the page that called this code
    if (selected.length > 0) {
      OnAddBuddyToInvites(selected)
    }
  }, [selected, buddies]);

  //Make sure to not reinvite someone in the workout
  const checkNewInvites = () => {

    const alreadyInWorkout = [
      ...allParticipants.map(item => item.profiles.id),
      ...allInvitations.map(item => item.profiles.id)
    ];
  
    return selected.filter(item => !alreadyInWorkout.includes(item.id));
      
  }

  //change styling based on which page called this code
  const selectBoxFlex = forNew ? {flex : 1 } : {flex : 6};

  //function to send invites to selected users and tries to send notification on successful invite
  const sendInvites = () => {
      let workout_id = workout.id
      let newInvites = checkNewInvites();
      inviteToWorkout({selected : newInvites, workout_id},
        {
          onSuccess: async () => {
            for (let buddy of newInvites)
            {
              await notifyUserAboutNewInvite(buddy.id)
            }
  
          },
        }
      )
      setSelected([])
  }

  //styling to show a check when an item is selected in the dropdown multi select
    const renderItem = item => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
          {selected.some(i => i.id === item.value.id) && (
            <AntDesign
              style={styles.icon}
              color="black"
              name="checkcircleo"
              size={20}
            />
          )}
        </View>
      );
    };

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
            renderItem={renderItem}
            
          />
          </View>


          {!forNew && 
            <TouchableOpacity onPress={sendInvites} style={styles.button}>
              <Text style={styles.buttonText}>Invite</Text> 
            </TouchableOpacity>
          }
      </View>

       
      }
      <View style={styles.listGap}>


        {allInvitations && allInvitations.map((buddie) => (
          <InternalWorkoutBuddyListItem key={buddie.id} buddie={buddie} forNew={forNew} workout={null}/>
        ))}
        {allParticipants && allParticipants.map((buddie) => (
          <InternalWorkoutBuddyListItem key={buddie.id} buddie={buddie} forNew={forNew} workout={workout}/>
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



  placeholderStyle: {
    fontSize: 16,
    
  },

  selectedTextStyle: {
    fontSize: 16
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
  },

  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },


});

