
import {SafeAreaView} from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { supabase } from './utils/supabase';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './providers/AuthProvider';
import WorkoutBuddiesList from './WorkoutBuddiesList';

import {useState, useEffect} from 'react';
import { buddyProfiles, userBuddies } from './api/buddies';
import { ActivityIndicator } from 'react-native';


export default function Buddy() {

  const { session } = useAuth();
  const [selected, setSelected] = useState('');

    const {data: buddie_ids, isLoading : isLoadingBIds} = userBuddies(session?.user.id);

    const { data: buddies, isLoading : isLoadingB} = buddyProfiles(buddie_ids)
  
    if (isLoadingBIds|| isLoadingB) {
      return <ActivityIndicator />;
    }
    return (
      <SafeAreaView style={{flex: 1}}>
      <WorkoutBuddiesList buddies={buddies}/>
      </SafeAreaView>
    );
  }