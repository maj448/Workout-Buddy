//This file containes all the database queries related to buddies table
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/app/utils/supabase';


//Get the profile of each account the user has a buddy relationship with
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
            .in('id', buddie_ids.map((p) => p.buddy_user_id))
            .order('username', { ascending: true }); 
    
          if (error) throw new Error(error.message);
          return data;
        },
        });
            
}


//Add a new buddy relationship for the user and the buddy they are adding
//first checks that the buddy relationship doesn't already exist
export const useAddBuddy = () => {

  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data : any) {


      const { data : usernameData, error : usernameError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', data.username)
          .single()

          if (usernameError) {
            console.log(usernameError)
            throw usernameError;
          }
  
        if(!usernameData)
          return [];


        const { data : alreadyExist, error : alreadyExistError } = await supabase
        .from('buddies')
        .select('id')
        .eq('user_id', data.user_id)
        .eq('buddy_user_id', usernameData.id)
        .single()


        if(alreadyExist)
          return data.user_id

      const { data: userData, error: userError } = await supabase.from('buddies').insert({
        user_id: data.user_id,
        buddy_user_id: usernameData.id,
      })


      if (userError) {
        console.log(userError)
        throw userError;
      }

      const { data: buddyData, error: buddyError } = await supabase.from('buddies').insert({
        user_id: usernameData.id,
        buddy_user_id: data.user_id,
      })

      return data.user_id


    },
    async onSuccess(returnedData) {
      await queryClient.invalidateQueries(['buddies', returnedData.user_id]);

    },
    onError(error) {
    },
  });

};

//delete the buddie relationships between user and selected buddy
export const useRemoveBuddie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data :any) {

      const { error } = await supabase.from('buddies').delete()
      .eq('user_id', data.user_id)
      .eq('buddy_user_id', data.buddy_id);

      if (error) {
        console.log(error)
        throw new Error(error.message);
        
      }


      const { error: buddyError} = await supabase.from('buddies').delete()
      .eq('user_id', data.buddy_id)
      .eq('buddy_user_id', data.user_id);
      

      if (buddyError) {
        console.log(buddyError)
        throw new Error(buddyError.message);
        
      }

      return { user_id : data.user_id };
    },
    async onSuccess(returnedData) {
      await queryClient.invalidateQueries(['buddies', returnedData?.user_id]);
    },
  });
};

