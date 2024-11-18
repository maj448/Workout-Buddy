import React from 'react';
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
