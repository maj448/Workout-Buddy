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


// export const workoutBuddies = (user_id, workout_id) => {

//   return useQuery({
//       queryKey : ['buddies', user_id, workout_id], 
//       queryFn: async () => {
//         const { data : userData, error : userError } = await supabase
//           .from('participants')
//           .select('user_id')
//           .eq('workout_id', workout_id)
//           .neq('user_id', user_id)

//           if (userError) 
//             throw new Error(userError.message);
  
//         if(!userData)
//           return [];

//         const {data: profileData , error : profileError} = await supabase
//           .from('profiles')
//           .select('*')
//           .in('id', userData.map((p) => p.user_id))

//         if (profileError) 
//           throw new Error(profileError.message);

//         return profileData ;
//       },
//   });
          
// }

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
      //console.log(error);
    },
  });

};

export const useInviteBuddies = () => {

  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data : any) {
      const { data: workoutData, error: workoutError } = await supabase.from('workouts').insert({
        title: data.inputTitle,
        notes: data.inputNotes,
        workout_date: data.inputDate.toISOString(),
        workout_status:  'upcoming',
        start_time: data.inputStartTime.toISOString(),
        end_time: data.inputEndTime.toISOString(),
      }).select('id');

      if (workoutError) {
        console.log(workoutError)
        throw workoutError;
      }
      
      //return workoutData

      if(workoutData && workoutData.length > 0){
      const { error: participantError } = await supabase.from('participants').insert({
        user_id: data.user_id,
        workout_id: workoutData[0].id
      });

      if (participantError) {
        console.log(participantError)
        throw participantError;
      }

      return { user_id : data.user_id };

    }
    },
    async onSuccess(returnedData) {
      console.log('Mutation successful:', returnedData);
      await queryClient.invalidateQueries(['participants', returnedData?.user_id]);
      //await queryClient.invalidateQueries(['workouts', {participants: [...returnedData.old_workouts, { workout_id: returnedData.workout_id } ]}]);
      console.log('Queries invalidated successfully');
    },
    onError(error) {
      //console.log(error);
    },
  });

};