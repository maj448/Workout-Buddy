import React, { useEffect, useState } from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import index from './index'; 
import Profile from './Profile'; 
import Buddies from './Buddies'; 
import NewWorkoutScreen from './NewWorkout';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import WorkoutDetailsScreen from './Workoutdetails';
import AuthProvider from './providers/AuthProvider';
import { useAuth } from './providers/AuthProvider';
import QueryProvider from './providers/QueryProvider';
import InWorkout from './InWorkout';
import Example from './Example';

const Tab = createBottomTabNavigator();


function MyTabs() {
  const { session } = useAuth();
  if (!session) {
    return <Login />;
  }

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
  const { session } = useAuth();

  const [initialRoute, setInitialRoute] = useState('Tabs'); 

  useEffect(() => {
    if (session) {
      setInitialRoute('Tabs'); 
    } else {
      setInitialRoute('Login'); 

    }
  }, [session]); 

  return (
    
    <AuthProvider>
      <QueryProvider>
        <NavigationIndependentTree>
          <NavigationContainer>
          <Stack.Navigator initialRouteName= {initialRoute}>  
            <Stack.Screen 
                name="Tabs" 
                component={MyTabs} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="Login" 
                component={Login} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="In Workout" 
                component={InWorkout} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen name="Sign Up" component={SignUp} />
            <Stack.Screen name="Example" component={Example} />
            <Stack.Screen name="New Workout" component={NewWorkoutScreen} />
            <Stack.Screen name="Workout Details" component={WorkoutDetailsScreen} />
          </Stack.Navigator>
          
        </NavigationContainer>
      </NavigationIndependentTree>
    </QueryProvider>
  </AuthProvider>

  );
}
