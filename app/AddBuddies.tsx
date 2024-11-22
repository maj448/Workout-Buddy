
import {SafeAreaView} from 'react-native-safe-area-context';
import { View, Text, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './utils/supabase';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './providers/AuthProvider';


import {useState, useEffect} from 'react';

import { ActivityIndicator } from 'react-native';


export default function Buddy() {
 
    const navigation = useNavigation();
    const onAddBuddy = () => {
        //call function to add buddy
        
        navigation.navigate('Buddies')
      };

    return (
      <SafeAreaView style={{flex: 1}}>
        <Text>Add Buddy:</Text>
        <TextInput/>
      </SafeAreaView>
    );
  }