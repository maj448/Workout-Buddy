import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/app/utils/supabase';



export const userBuddies = (user_id : string) => {

    return useQuery({
        queryKey : ['buddies', user_id], 
        queryFn: async () => {
          const { data : buddie_ids, error: idError } = await supabase
            .from('buddies')
            .select('buddy_user_id')
            .eq('user_id', user_id); 

    
          if (idError) 
            throw new Error(idError.message);

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


// export const buddyProfiles = (buddie_ids) => {
//     return useQuery({
//         queryKey : ['profiles', { buddieIds: buddie_ids?.map((p) => p.buddy_user_id) }],
//         queryFn: async () => {
//           if (!buddie_ids || buddie_ids.length === 0) return []; 
    
//           const { data, error } = await supabase
//             .from('profiles')
//             .select('*')
//             .in('id', buddie_ids.map((p) => p.buddy_user_id)); 
    
//           if (error) throw new Error(error.message);
//           return data;
//         },
    
//       });

// }

export const workoutBuddies = (user_id, workout_id) => {

  return useQuery({
      queryKey : ['buddies', user_id, workout_id], 
      queryFn: async () => {
        const { data : userData, error : userError } = await supabase
          .from('participants')
          .select('user_id')
          .eq('workout_id', workout_id)
          .neq('user_id', user_id)

          if (userError) 
            throw new Error(userError.message);
  
        if(!userData)
          return [];

        const {data: profileData , error : profileError} = await supabase
          .from('profiles')
          .select('*')
          .in('id', userData.map((p) => p.user_id))

        if (profileError) 
          throw new Error(profileError.message);

        return profileData ;
      },
  });
          
}