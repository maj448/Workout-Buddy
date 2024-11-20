import { View, Text, StyleSheet, Button } from 'react-native';
import { supabase } from './utils/supabase';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './providers/AuthProvider';
import { useEffect, useState } from 'react';
import { userProfileDetails } from './api/profile';

const ProfileScreen = () => {
  const { session } = useAuth();


  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState()
  const [userProfileFullName, setUserProfileFullName] = useState()
  const [userProfileUserame, setUserProfileUserame] = useState()
  const [userProfileAvatar, setUserProfileAvatar] = useState()

  if(!session){
    navigation.navigate("Login");
  }



  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigation.navigate("Login");
    
  };

  const { data: profile } =  userProfileDetails(session?.user.id)


 
  useEffect(() => {
    if (profile) {
      setUserProfile(profile.id); 
      setUserProfileFullName(profile.full_name)
      setUserProfileUserame(profile.username)
      setUserProfileAvatar(profile.avatar_url)
    }
  }, [profile]);
  

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Text>Full name: {userProfileFullName}</Text>
      <Text>Username: {userProfileUserame}</Text>
      <Text>Avatar: {userProfileAvatar}</Text>
      <Button title="Log Out" onPress={handleSignOut}/>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;