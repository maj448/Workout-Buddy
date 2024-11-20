
import {SafeAreaView} from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';

import {useState, useEffect} from 'react';


export default function Buddy() {

  const [selected, setSelected] = useState('');
  
    return (
      <SafeAreaView>
       <Text> buddies</Text>
      </SafeAreaView>
    );
  }