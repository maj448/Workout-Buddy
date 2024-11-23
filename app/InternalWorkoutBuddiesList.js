import { View, Text, FlatList, TextInput, Button, Pressable, StyleSheet } from "react-native"
import InternalWorkoutBuddyListItem from "./InternalWorkoutBuddyListItem";
import React, {useEffect, useState} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';



export default function InternalWorkoutBuddiesList({buddies, forNew, OnAddBuddyToInvites}){

  console.log(buddies)


  const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [inviteBuddyList, setInviteBuddyList] = useState([])
    const [dropdownData, setDropdownData] = useState([])

    const OnAddBuddy = (selectedValue) => {
      
 
      setInviteBuddyList(prevList => {

        if(!prevList.includes(selectedValue)){
          const updatedList = [selectedValue, ...prevList];
          return updatedList;
        }
        return prevList;
      });
    };

    useEffect(() => {

      if(buddies){
      const newDropdownData = buddies.map(buddy => ({
        label: buddy.username, 
        value: buddy        
      }));


      setDropdownData(newDropdownData)
      console.log('dropdown', dropdownData)
    }

      if (inviteBuddyList.length > 0) {
        OnAddBuddyToInvites(inviteBuddyList)
      }
    }, [inviteBuddyList, buddies]);

  const navigation = useNavigation();

    return(
    <View style={{backgroundColor: '#6EEB92', padding: 10, gap: 10}}>
      <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24, }}>Buddies</Text>
      <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10}}>
        
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' } ]}
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
          value={value ? value : null}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            OnAddBuddy(item.value);
            setIsFocus(false);
          }}

        />

        {/* { forNew &&
          <Pressable onPress={OnAddSelected} >
            <Ionicons name="add-circle-outline" size={24} color="white" />
          </Pressable>
        } */}

        {!forNew && 
          <Pressable onPress={OnAddBuddy} style={styles.button}>
            <Text style={styles.buttonText}>Invite</Text> 
          </Pressable>}
      </View>

      <View>

        {inviteBuddyList && inviteBuddyList.map((buddie) => (
          <InternalWorkoutBuddyListItem key={buddie.id} buddie={buddie} forNew={forNew}/>
        ))}

      </View>



        
    </View>
    );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    width: 250,
    borderColor: 'gray',
    backgroundColor: 'lightgray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 20,
    flex: 6
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
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
  }


});

