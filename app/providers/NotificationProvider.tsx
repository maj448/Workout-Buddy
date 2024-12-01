//This code was adapted from https://notjust.notion.site/React-Native-Supabase-Masterclass-47a69a60bc464c399b5a0df4d3c4a630
// a tutorial made to connect a react native expo app to supabase


//This code is supposed to added the expo push token to supabase to allow notifications but I could not get it to work

import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import { ExpoPushToken } from 'expo-notifications';
import * as Notifications from 'expo-notifications';
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthProvider';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState<String | undefined>();

  const { profile } = useAuth();

  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const savePushToken = async (newToken: string | undefined) => {
    setExpoPushToken(newToken);
    if (!newToken) {
      return;
    }

    const { error : updateE } = await supabase
      .from('profiles')
      .update({ expo_push_token : newToken, })
      .eq('id', profile?.id);

      if (updateE) {
        console.log(updateE)
        throw new Error(updateE.message);
      }
      }


  
  ;

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => savePushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [profile]);



  return <>{children}</>;
};

export default NotificationProvider;