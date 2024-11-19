import React, { useEffect, useState } from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import index from './index'; 
import Profile from './Profile'; 
import Buddies from './Buddies'; 
import NewWorkoutScreen from './newWorkout';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from './utils/supabase'

//import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
//const supabase = createClient('https://ngebhfjgfoflnulujbsw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nZWJoZmpnZm9mbG51bHVqYnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4OTc3MjcsImV4cCI6MjA0NzQ3MzcyN30.t0IjdmFGXgXd_XcwwPT5TxODZIQPxmva7KXu3-kPJ_M')

const Tab = createBottomTabNavigator();


function MyTabs() {
	return (
		<Tab.Navigator>
        <Tab.Screen 
        name="Home" 
        component={index} 
        options={{
        tabBarIcon: () => (
          <Entypo name="home" size={24} color="black" />
          ),
          tabBarLabel: 'Home',
          headerShown: false,
        }}
        />

        <Tab.Screen 
        name="Buddies" 
        component={Buddies} 
        options={{
          tabBarIcon: () => (
            <FontAwesome5 name="user-friends" size={24} color="black" />
            ),
            tabBarLabel: 'Buddies',
          }}
        />
        <Tab.Screen 
        
        name="Profile" 
        component={Profile} 
        options={{
          tabBarIcon: () => (
            <AntDesign name="user" size={24} color="black" />
            ),
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
	);
}

const Stack = createStackNavigator ();

export default function RootLayout() {
  const [userCount, setUserCount] = useState(0)

  
  return (
    
    <NavigationIndependentTree>
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen 
          name="Tabs" 
          component={MyTabs} 
          options={{ headerShown: false }} 
      />
      <Stack.Screen name="New Workout" component={NewWorkoutScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  </NavigationIndependentTree>
  );
}

// import { useState, useEffect } from 'react'
// import { supabase } from './utils/supabase'
// import Auth from './Auth'
// import Account from './Account'
// import { View } from 'react-native'
// import { Session } from '@supabase/supabase-js'

// export default function App() {
//   const [session, setSession] = useState<Session | null>(null)

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session)
//     })

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session)
//     })
//   }, [])

//   return (
//     <View>
//       {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
//     </View>
//   )
// }