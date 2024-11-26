import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { supabase } from './utils/supabase';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './providers/AuthProvider';
import { useEffect, useState } from 'react';
import { userProfileDetails } from './api/profile';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const { session } = useAuth();


  const navigation = useNavigation();
  const [userProfileFullName, setUserProfileFullName] = useState()
  const [userProfileUserame, setUserProfileUserame] = useState()
  const [userProfileAvatar, setUserProfileAvatar] = useState()
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<string | null>(null);

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

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
 
  useEffect(() => {
    if (profile) {
      setUserProfileFullName(profile.full_name)
      setUserProfileUserame(profile.username)
      setUserProfileAvatar(profile.avatar_url)
    }
  }, [profile]);
  

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
      <Image
        source={{ uri: image ||  userProfileAvatar}}
        style={styles.image}
        resizeMode="contain"
      />
      <Text  onPress= {pickImage} style={styles.imageButton}>Change Profile Picture</Text>
      <Text>Full name: {userProfileFullName}</Text>
      <Text>Username: {userProfileUserame}</Text>
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
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 100,
    borderColor: 'black',
    borderWidth: 2,
    margin: 10
  },
  imageButton: {

    alignSelf: 'center',
  },
});

export default ProfileScreen;