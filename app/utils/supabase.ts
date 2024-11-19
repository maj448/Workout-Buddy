import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ngebhfjgfoflnulujbsw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nZWJoZmpnZm9mbG51bHVqYnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4OTc3MjcsImV4cCI6MjA0NzQ3MzcyN30.t0IjdmFGXgXd_XcwwPT5TxODZIQPxmva7KXu3-kPJ_M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});