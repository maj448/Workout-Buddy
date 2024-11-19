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
import Ionicons from '@expo/vector-icons/Ionicons';

// import Auth from './Auth'
// import SignUp from './SignUp'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'

import Login from './auth/Login';
import SignUp from './auth/SignUp';
import WorkoutDetailsScreen from './Workoutdetails';


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
            <Ionicons name="person" size={24} color="black" />
            ),
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
	);
}

const Stack = createStackNavigator ();

export default function RootLayout() {
  
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    
    <NavigationIndependentTree>
    <NavigationContainer>
    {/* <Stack.Navigator initialRouteName= { session && session.user ? "Tabs": "Login"}> */}
    <Stack.Navigator initialRouteName= {"Login"}>  
      <Stack.Screen 
          name="Tabs" 
          component={MyTabs} 
          options={{ headerShown: false }} 
      />
      {/* <Stack.Screen 
          name="Login" 
          component={Auth} 
          options={{ headerShown: false }} 
      /> */}
      <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
      />
            <Stack.Screen 
          name="Sign Up" 
          component={SignUp} 
      />
      <Stack.Screen name="New Workout" component={NewWorkoutScreen} />
      <Stack.Screen name="Workout Details" component={WorkoutDetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  </NavigationIndependentTree>
  );
}
