import React, { useEffect, useState } from 'react';

import AuthProvider from './providers/AuthProvider';
import { useAuth } from './providers/AuthProvider';
import QueryProvider from './providers/QueryProvider';
import Example from './Example';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';




export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   // const [loaded, error] = useFonts({
//   //   SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
//   //   ...FontAwesome.font,
//   // });

//   // // Expo Router uses Error Boundaries to catch errors in the navigation tree.
//   // useEffect(() => {
//   //   if (error) throw error;
//   // }, [error]);

//   // useEffect(() => {
//   //   if (loaded) {
//   //     SplashScreen.hideAsync();
//   //   }
//   // }, [loaded]);

//   // if (!loaded) {
//   //   return null;
//   // }

//   return <RootLayoutNav />;
// }

export default function RootLayoutNav() {


  return (
    
    <AuthProvider>
      <QueryProvider>
          <Stack >  
            <Stack.Screen 
                name="(tabs)" 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="(auth)" 
                options={{ headerShown: false }} 
            />
          </Stack>
    </QueryProvider>
  </AuthProvider>

  );
}
