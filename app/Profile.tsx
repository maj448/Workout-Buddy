import { View, Text, StyleSheet, Button, Pressable } from 'react-native';
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
  const [loading, setLoading] = useState(false)

  if(!session){
    navigation.navigate("Login");
  }



  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut();
    setLoading(false)
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
      <View style={styles.infoContainer}>
      <Text>Profile Screen</Text>
      <Text>Full name: {userProfileFullName}</Text>
      <Text>Username: {userProfileUserame}</Text>
      <Text>Avatar: {userProfileAvatar}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable onPress={handleSignOut} disabled={loading} style={styles.button}>
            <Text style={styles.buttonText}>{loading ? 'Logging Out...' : 'Log Out'} </Text>
        </Pressable>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 10,

  },
  buttonText : {
    fontSize: 16,
    color: '#3D3D3D',
    fontFamily: 'fantasy'
  },
  buttonContainer : {
    flex:2, 
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  infoContainer : {
    flex:6, 
    alignItems: 'center',
    justifyContent: 'flex-start',
  }
});

export default ProfileScreen;