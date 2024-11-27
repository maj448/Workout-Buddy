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



export const usernameUnique = () => {


  return useQuery({
    queryKey: ['profilesusername'],
    queryFn: async () => {
        const { data: usernameFound, error } = await supabase
          .from('profiles')
          .select('username')
  
        if (error) 
          {console.log(error)
            throw new Error(error.message);}
        return usernameFound;
      },
    });
}


export const useUpdateProfilePic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error, } = await supabase
        .from('profiles')
        .update({
          avatar_url : data.image,

        })
        .eq('id', data.user_id)

      if (error) {
        console.log(error)
        throw new Error(error.message);
      }

      return {user_id : data.user_id};
    },
    async onSuccess(returnedData) {

      await queryClient.invalidateQueries(['profiles', returnedData?.user_id]);
    },
  });
};
