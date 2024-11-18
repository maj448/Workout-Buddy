import { View, Text, StyleSheet, Button} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRealm, useQuery } from '@realm/react';
import {ProfileTest} from './models/ProfileTest';

export default function Profile() {
  const realm = useRealm();  // Access the Realm instance
  const profiles = useQuery('Profile');  // Query the Profile model

  const [newProfile, setNewProfile] = useState({
    name: '',
    age: 0,
    email: '',
  });

  // Function to add a new profile to Realm
  const addProfile = () => {
    realm.write(() => {
      realm.create('Profile', {
        _id: new Realm.BSON.ObjectId(),  // Create a unique ID
        name: newProfile.name,
        age: newProfile.age,
        email: newProfile.email,
      });
    });
  };

  return (
    <View>
      <Text>Profiles:</Text>
      {profiles.map((profile) => (
        <Text key={profile._id.toString()}>
          {profile.name} ({profile.age}) - {profile.email}
        </Text>
      ))}
      
      {/* Add new profile */}
      <Button title="Add New Profile" onPress={addProfile} />
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

