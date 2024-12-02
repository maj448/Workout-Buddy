//This is the screen to view and edit the signed in users Profile
import { View, Text, StyleSheet, Pressable, TouchableOpacity, TextInput } from 'react-native';
import { supabase } from './utils/supabase';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './providers/AuthProvider';
import { useEffect, useState } from 'react';
import { userProfileDetails, useUpdateProfilePic } from './api/profile';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { randomUUID } from 'expo-crypto';
import RemoteImage from './components/RemoteImage';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ActivityIndicator } from 'react-native';

const ProfileScreen = () => {
  const { session } = useAuth();
  const navigation = useNavigation();
  const [userProfileFullName, setUserProfileFullName] = useState('')
  const [userProfileUserame, setUserProfileUserame] = useState('')
  const [userProfileAvatar, setUserProfileAvatar] = useState('')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState("https://img.icons8.com/nolan/64/user-default.png");
  const [editView, setEditView] = useState(false)
  const [loadingUpdate, setLoadingUdate] = useState(false)

  if(!session){
    navigation.navigate("Login");
  }

  //get the database function to update the profile picture
  const {mutate: updatePic} = useUpdateProfilePic();


  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut();
    setLoading(false)
    navigation.navigate("Login");
    
  };

  // get the user's profile details from the database
  const { data: profile , isLoading } =  userProfileDetails(session?.user.id)

  const updateProfilePic = async () => {

    setLoadingUdate(true)
    //update the picture after it has successfuly been added in database storsge
    const imagePath = await uploadImage();
    updatePic({user_id: session?.user.id, image : imagePath},{
      onSuccess: () => {
        setLoadingUdate(false);
      },
    })
    setEditView(false)
  }

  //upload the image to database storage
  // code from https://notjust.notion.site/React-Native-Supabase-Masterclass-47a69a60bc464c399b5a0df4d3c4a630
  const uploadImage = async () => {
    if (!image?.startsWith('file://')) {
      return;
    }
  
    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64',
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, decode(base64), { contentType });
  
    if (data) {
      return data.path;
    }
  };

  //allow the picking of image from a persons camera roll
  const pickImage = async () => {

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need permission to access your photos!');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });



    if (!result.canceled) {
      setImage(result.assets[0].uri);

    }
  };

  const editProfile = () => {
      setEditView(!editView)
  }

  
 
  useEffect(() => {
    if (profile) {
      setUserProfileFullName(profile.full_name)
      setUserProfileUserame(profile.username)
      setUserProfileAvatar(profile.avatar_url)
    }
  }, [profile]);
  

    //show an indication if the queries are loading
    if ( isLoading) {
      return <ActivityIndicator />;
    }

  return (
    <View style={styles.container}>
      <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10}}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 40}}>Profile</Text>
        <TouchableOpacity onPress={editProfile}>
        <FontAwesome6 name="edit" size={30} color="white" />
        </TouchableOpacity>
        </View>
      <View style={styles.infoContainer}>

        <TouchableOpacity  onPress= {pickImage}  disabled={!editView} style={styles.imageButton}>
          <RemoteImage
          path={userProfileAvatar}
          fallback='https://img.icons8.com/nolan/64/user-default.png'
          style={styles.image}
          resizeMode="contain"
            />
        </TouchableOpacity>
        { editView &&
          <Text style={styles.label}>Change Profile Picture</Text>
        }

        { !editView &&
          <View>
            <Text style={styles.label}>Full name: {userProfileFullName}</Text>
            <Text style={styles.label}>Username: {userProfileUserame}</Text>
          </View>
        }

        { editView &&
          <View style={styles.buttonContainer}>
            
            <TouchableOpacity onPress={updateProfilePic}  style={styles.button}>
              <Text style={styles.buttonText}>{loadingUpdate ? 'Updating...' : 'Update Profile'}</Text>
            </TouchableOpacity>
            <Text>*To see and save the changed profile picture you must Update profile</Text>
          </View>
        }
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignOut} disabled={loading} style={styles.button}>
            <Text style={styles.buttonText}>{loading ? 'Logging Out...' : 'Log Out'} </Text>
        </TouchableOpacity>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
    backgroundColor: '#6EEB92',
  },
  
  button: {
    width: 200,
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
    paddingTop: 10
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

  label: {
    fontSize: 20,
    color: '#3D3D3D',
    marginVertical: 5,
  },

  inputArea:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 10,
    flex: 1

  },



});

export default ProfileScreen;