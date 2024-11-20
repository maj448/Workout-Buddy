import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/app/utils/supabase';



export const userBuddies = (user_id) => {

    return useQuery({
        queryKey : ['buddies', user_id], 
        queryFn: async () => {
          const { data, error } = await supabase
            .from('buddies')
            .select('buddy_user_id')
            .eq('user_id', user_id); 
    
          if (error) 
            throw new Error(error.message);
          return data;
        },
        });
            
}


export const buddyProfiles = (buddie_ids) => {
    return useQuery({
        queryKey : ['profiles', { buddieIds: buddie_ids?.map((p) => p.buddy_user_id) }],
        queryFn: async () => {
          if (!buddie_ids || buddie_ids.length === 0) return []; 
    
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .in('id', buddie_ids.map((p) => p.buddy_user_id)); 
    
          if (error) throw new Error(error.message);
          return data;
        },
    
      });

}