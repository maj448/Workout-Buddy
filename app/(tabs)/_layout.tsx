import React, { useEffect, useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';

import AuthProvider from '../providers/AuthProvider';
import { useAuth } from '../providers/AuthProvider';
import Example from '../Example';

import { Link, Redirect, Tabs } from 'expo-router';

// const Tab = createBottomTabNavigator();


export default function MyTabs() {
  const { session } = useAuth();
  if (!session) {
    return <Redirect href={'../Login'} />;
  }

	return (

		<Tabs>
        <Tabs.Screen 
        name="home" 
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: () => (
          <Entypo name="home" size={24} color="black" />
          ),
        }}
        />

        <Tabs.Screen 
        name="buddies"
        options={{
          title: 'Buddies',
          headerShown: false,
          tabBarIcon: () => (
            <FontAwesome5 name="user-friends" size={24} color="black" />
          ),
        }} 
        />

        <Tabs.Screen 
        
        name="profile" 
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: () => (
            <Ionicons name="person" size={24} color="black" />
          ),
        }} 
        />
      </Tabs>
	);
}


