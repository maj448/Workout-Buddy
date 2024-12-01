//This file containes all the database queries related to the profile table
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/app/utils/supabase';


//get the profile details of the specified user
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


//On the creation of an account, checks if the username added already exists in the database
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

//Updates the avatar_url with a supabase storage photo
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
