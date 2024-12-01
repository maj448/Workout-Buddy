//This code has the subscriptions to listen for certain database changes
import {  useEffect, useCallback} from 'react'
import { supabase } from '../utils/supabase'
import {  useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';


//check if there are any new invites for the user
export const useInviteSubscription = (user_id) => {
    const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {

      const inviteSubscription = supabase
        .channel('custom-filter-channel')
        .on(
          'postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'invitations', 
            filter: `user_id=eq.${user_id}` 
          },
          (payload) => {
            queryClient.invalidateQueries(['invitations', user_id]);
          }
        )
        .subscribe();
      return () => {
        inviteSubscription.unsubscribe();
      };
    }, [])
  );
};

//check if there are any participant changes for a workout
export const useParticipantSubscription = ( workout_id) => {
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
  
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
      };
    }, [])
  );
};


//check only for updates in workout participants
export const useParticipantUpdateSubscription = ( workout_id) => {
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
  
    const participantUpdateSubscription = supabase.channel('custom-filter-channel')
    .on(
      'postgres_changes',
      { event: 'UPDATE', 
        schema: 'public', 
        table: 'participants', 
        filter: `workout_id=eq.${workout_id}` },
      (payload) => {
        queryClient.invalidateQueries(['participants', workout_id])
        
      }
    )
    .subscribe()
    
      return () => {
        participantUpdateSubscription.unsubscribe();
      };
    }, [])
  );
};

//check for any changes in invitations for a workout
export const useInvitationsSubscription = (workout_id) => {
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
  
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
      };
    }, [])
  );
};

