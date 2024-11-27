import {  useEffect} from 'react'
import { supabase } from '../utils/supabase'
import {  useQueryClient } from '@tanstack/react-query';



export const useInviteSubscription = (user_id) => {
    const queryClient = useQueryClient();

    useEffect(() => {
    
        const inviteSubscription = supabase.channel('custom-filter-channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', 
            schema: 'public', 
            table: 'invitations', 
            filter: `user_id=eq.${user_id}`},
          (payload) => {
            console.log('query success', payload)
            queryClient.invalidateQueries(['invitations', user_id])
          }
        )
        .subscribe()
      
        return () => {
          inviteSubscription.unsubscribe();
        }
         
      }, []);

}