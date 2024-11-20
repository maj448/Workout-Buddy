import { Redirect } from 'expo-router';

export default function TabIndex() {
  console.log ('tabs')
  return <Redirect href={'/(auth)/LogIn'} />;
}
