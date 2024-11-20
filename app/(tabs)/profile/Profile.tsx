import { View, Text, StyleSheet, Button } from 'react-native';
import { supabase } from '../../utils/supabase';
//import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../providers/AuthProvider';
import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';

const ProfileScreen = () => {
  const { session } = useAuth();
  //const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState()

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    //navigation.navigate("Login");
    return <Redirect href={'../Login/'} />
    
  };

  const { data: profile } = useQuery({
    queryKey: ['profiles', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user.id)
        .single(); 

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!session?.user.id, 
  });

 
  useEffect(() => {
    if (profile) {
      setUserProfile(profile); 
    }
  }, [profile]);
  

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Text>{userProfile.full_name}</Text>
      <Text>{userProfile.username}</Text>
      <Text>{userProfile.avatar_url}</Text>
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