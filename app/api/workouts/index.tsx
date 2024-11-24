import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/app/utils/supabase';





export const participantWorkouts = (user_id ) => {
    
  return useQuery({
    queryKey : ['participants', user_id], 
    queryFn: async () => {
      const { data : participants, error : participantsError } = await supabase
        .from('participants')
        .select('workout_id')
        .eq('user_id', user_id); 

      if (participantsError) 
        throw new Error(participantsError.message);

      

      if (!participants || participants.length === 0) return [];

      const { data : workouts, error } = await supabase
          .from('workouts')
          .select('*')
          .in('id', participants.map((p) => p.workout_id)); 
  
        if (error) throw new Error(error.message);


      return workouts;
    },
    });
    
      
  
}

export const invitedWorkouts = (user_id ) => {
    
  return useQuery({
    queryKey : ['invitations', user_id], 
    queryFn: async () => {
   
      const { data : invited, error : invitedError } = await supabase
      .from('invitations')
      .select('workout_id')
      .eq('to_user_id', user_id); 



      if (invitedError) 
        throw new Error(invitedError.message);


      if (!invited || invited.length === 0) return [];

      const { data : workouts, error } = await supabase
          .from('workouts')
          .select('*')
          .in('id', invited.map((p) => p.workout_id)); 
  
        if (error) throw new Error(error.message);

        console.log(workouts)

      return workouts;
    },
    });
    
      
  
}

export const participantWorkoutInfo = (user_id, workout_id ) => {

  return useQuery({
      queryKey : ['participants', user_id, workout_id], 
      queryFn: async () => {
        const { data, error } = await supabase
          .from('participants')
          .select('*')
          .eq('user_id', user_id)
          .eq('workout_id', workout_id).single(); 
  
        if (error) 
          throw new Error(error.message);
        return data;
      },
      });
      
  
};

export const useInsertWorkout = () => {

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

      if(data.inviteBuddyList && data.inviteBuddyList.length > 0){
        for (let buddy of data.inviteBuddyList) {
          const { error: inviteError } = await supabase.from('invitations').insert({
            from_user_id: data.user_id,
            workout_id: workoutData[0].id,
            to_user_id: buddy.id,
            invite_status: 'pending', 
          });

          if (inviteError) {
            console.log(inviteError)
            throw inviteError;
          }
        }
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

export const useRemoveWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data :any) {
      const { error } = await supabase.from('participants').delete()
      .eq('user_id', data.user_id)
      .eq('workout_id', data.workout_id);

      if (error) {
        console.log(error)
        throw new Error(error.message);
        
      }

      console.log('data', data)
      const { data : anyParticipants, error: anyError } = await supabase.from('participants').select('*')
      .eq('workout_id', data.workout_id);


      console.log('anyprt', anyParticipants)
      if (anyError) {
        throw new Error(anyError.message);
      }

      if (!anyParticipants || anyParticipants.length === 0)
      {
        console.log('got to workout delete')
        const { error : workoutError } = await supabase.from('workouts').delete()
        .eq('id', data.workout_id);

        if (workoutError) {
          console.log(workoutError)
          throw new Error(workoutError.message);
        }
      }

      return { user_id : data.user_id };
    },
    async onSuccess(returnedData) {
      await queryClient.invalidateQueries(['participants', returnedData?.user_id]);
    },
  });
};


export const useUpdateParticipantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      console.log(data)
      const { error, data: updatedStatus } = await supabase
        .from('participants')
        .update({
          status : data.status
        })
        .eq('user_id', data.user_id)
        .eq('workout_id', data.workout_id)
        .select()
        .single();

      if (error) {
        console.log(error)
        throw new Error(error.message);
      }
      console.log(updatedStatus)
      return updatedStatus;
    },
    async onSuccess(returnedData) {
      console.log('on suc', returnedData)
      await queryClient.invalidateQueries(['participants', returnedData.user_id, returnedData.workout_id]);
    },
  });
};


export const useUpdateWorkoutStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      console.log(data)

      const { data : participants, error : participantsError } = await supabase
        .from('participants')
        .select('workout_id')
        .eq('user_id', data.user_id); 

      if (participantsError) 
        throw new Error(participantsError.message);

      if (!participants || participants.length === 0) return [];

      const { data : workouts, error : workoutsError } = await supabase
          .from('workouts')
          .select('*')
          .in('id', participants.map((p) => p.workout_id)); 
  
        if (workoutsError) throw new Error(workoutsError.message);

        //check if for each workout data.today > workout.workout_date 
        //if true status = 'past' if false don't update it

      //make a function to update the status of the affected workouts
      const { error, data: updatedStatus } = await supabase
        .from('workouts')
        .update({
          workout_status : data.status
        })
        .eq('id', data.workout_id)
        .select()

      if (error) {
        console.log(error)
        throw new Error(error.message);
      }
      console.log(updatedStatus)
      return updatedStatus;
    },
    async onSuccess(returnedData) {
      console.log('on suc', returnedData)
      await queryClient.invalidateQueries(['participants', returnedData.user_id, returnedData.workout_id]);
    },
  });
};