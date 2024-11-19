import { View, Text, StyleSheet, Button } from 'react-native';
import { supabase } from './utils/supabase';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {

  const navigation = useNavigation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigation.navigate("Login");
    
  };

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
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