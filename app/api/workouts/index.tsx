import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/app/utils/supabase';



export const participantWorkouts = (user_id ) => {

    return useQuery({
        queryKey : ['participants', user_id], 
        queryFn: async () => {
          const { data, error } = await supabase
            .from('participants')
            .select('workout_id')
            .eq('user_id', user_id); 
    
          if (error) 
            throw new Error(error.message);
          return data;
        },
        });
        
    
}

export const participantWorkoutsDetails = (participants) => {
    return useQuery({
        queryKey : ['workouts', { workoutIds: participants?.map((p) => p.workout_id) }],
        queryFn: async () => {
          if (!participants || participants.length === 0) return []; 
    
          const { data, error } = await supabase
            .from('workouts')
            .select('*')
            .in('id', participants.map((p) => p.workout_id)); 
    
          if (error) throw new Error(error.message);
          return data;
        },
    
      });
}