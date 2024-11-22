import { View, Text, FlatList, TextInput, Button, Pressable, StyleSheet } from "react-native"
import InternalWorkoutBuddyListItem from "./InternalWorkoutBuddyListItem";
import React, {useState} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';



export default function InternalWorkoutBuddiesList({buddies}){
  const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];

  const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    // const renderLabel = () => {
    //   if (value || isFocus) {
    //     return (
    //       <Text style={[styles.label, isFocus && { color: 'blue' }]}>
    //         Invite
    //       </Text>
    //     );
    //   }
    //   return null;
    // };

  const navigation = useNavigation();


    const inviteFriend = () => {
      navigation.navigate("Add Buddy")

    };
    return(
    <View style={{backgroundColor: '#6EEB92', padding: 10, gap: 10, flex: 2}}>
      <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24, }}>Buddies</Text>
      <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10}}>
        
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' } ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />
        <Pressable onPress={inviteFriend} style= {{flex: 1}}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
        </Pressable>
      </View>

        <FlatList
        data={buddies}
        contentContainerStyle={{ gap: 5 }}
        renderItem={({ item }) => (
          <InternalWorkoutBuddyListItem buddie={item} />
        )}
      />

       
        
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
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 20
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


});

