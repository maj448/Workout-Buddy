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
            queryClient.invalidateQueries(['invitations', user_id])
          }
        )
        .subscribe()
      
        return () => {
          inviteSubscription.unsubscribe();
        }
         
      }, []);

}


export const useParticipantSubscription = ( workout_id) => {
  const queryClient = useQueryClient();

  useEffect(() => {
  
    const participantSubscription = supabase.channel('custom-filter-channel')
    .on(
      'postgres_changes',
      { event: '*', 
        schema: 'public', 
        table: 'participants', 
        filter: `workout_id=eq.${workout_id}` },
      (payload) => {
        queryClient.invalidateQueries(['participants', workout_id])
      }
    )
    .subscribe()
    
      return () => {
        participantSubscription.unsubscribe();
      }
       
    }, []);

}


export const useInvitationsSubscription = (workout_id) => {
  const queryClient = useQueryClient();

  useEffect(() => {
  
    const invitationsSubscription = supabase.channel('custom-filter-channel')
  .on(
    'postgres_changes',
    { event: '*', 
      schema: 'public', 
      table: 'invitations', 
      filter: `workout_id=eq.${workout_id}` },
    (payload) => {
      queryClient.invalidateQueries(['invitations', workout_id])
    }
  )
  .subscribe()
    
      return () => {
        invitationsSubscription.unsubscribe();
      }
       
    }, []);

}

