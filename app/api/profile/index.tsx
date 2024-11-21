import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/app/utils/supabase';

export const userProfileDetails = (user_id ) => {

    return useQuery({
        queryKey: ['profiles', user_id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user_id)
            .single(); 
    
          if (error) throw new Error(error.message);
          return data;
        },
      });
}