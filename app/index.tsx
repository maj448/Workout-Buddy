
import { supabase } from './utils/supabase';
import { useAuth } from './providers/AuthProvider';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import { Link, Redirect } from 'expo-router';


// app/layout.tsx


export default function Page() {
  console.log('app index')
  return <Redirect href={'/(auth)/LogIn'} />;
}
// const index = () => {
//   const { session, loading,  } = useAuth();

//   if (loading) {
//     return <ActivityIndicator />;
//   }

//   if (!session) {
//     return <Redirect href={'./SignIn'} />;
//   }
//   else{
//     return <Redirect href={'./(tabs)'} />;
//   }


// };

// export default function Index() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
//       <Link href={'/(tabs)'} asChild>
//         Tabs
//       </Link>
//       <Link href={'/(auth)'} asChild>
//         Auth
//       </Link>
//     </View>
//   );
// };

