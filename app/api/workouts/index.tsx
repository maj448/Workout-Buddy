import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/app/utils/supabase';



export const participantWorkouts = (user_id ) => {
    
  return useQuery({
    queryKey : ['participants'], 
    queryFn: async () => {
      const { data : participants, error : participantsError } = await supabase
        .from('participants')
        .select('*, workouts(*)')
        .eq('user_id', user_id); 

      if (participantsError) 
        throw new Error(participantsError.message);

      return participants;
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
      .eq('user_id', user_id)
      .eq('invite_status', 'pending'); 



      if (invitedError) 
        throw new Error(invitedError.message);


      if (!invited || invited.length === 0) return [];

      const { data : workouts, error } = await supabase
          .from('workouts')
          .select('*')
          .in('id', invited.map((p) => p.workout_id)); 
  
        if (error) throw new Error(error.message);


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

export const allWorkoutParticipants = ( workout_id ) => {

  return useQuery({
      queryKey : ['participants', workout_id], 
      queryFn: async () => {
        const { data, error } = await supabase
          .from('participants')
          .select('*, profiles(*)')
          .eq('workout_id', workout_id); 
  
        if (error) 
          throw new Error(error.message);
        return data;
      },
      });
      
  
};

export const allWorkoutInvitations = ( workout_id ) => {

  const status = ['pending', 'declined']
  return useQuery({
      queryKey : ['invitations', workout_id], 
      queryFn: async () => {
        const { data, error } = await supabase
          .from('invitations')
          .select('*, profiles(*)')
          .eq('workout_id', workout_id)
          .in('invite_status', status);
  
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
            workout_id: workoutData[0].id,
            user_id: buddy.id,
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
      await queryClient.invalidateQueries(['participants', returnedData?.user_id]);
    },
    onError(error) {
      console.log(error);
    },
  });

};

export const useInviteToWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data : any) {
      if(data.selected && data.selected.length > 0){
        for (let buddy of data.selected) {
          const { error: inviteError } = await supabase.from('invitations').insert({
            workout_id: data.workout_id,
            user_id: buddy.id,
            invite_status: 'pending', 
          });

          if (inviteError) {
            console.log(inviteError)
            throw inviteError;
          }
        }

      return { workout_id : data.workout_id };
    }
    },
    async onSuccess(returnedData) {
      await queryClient.invalidateQueries(['invitations', returnedData?.workout_id]);
    },
    onError(error) {
      console.log(error);
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
      const { data : anyParticipants, error: anyError } = await supabase.from('participants').select('*')
      .eq('workout_id', data.workout_id);


      if (anyError) {
        throw new Error(anyError.message);
      }

      if (!anyParticipants || anyParticipants.length === 0)
      {
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
          status : data.status,
          duration : data.duration,
          activity : data.activity
        })
        .eq('user_id', data.user_id)
        .eq('workout_id', data.workout_id)
        .select()
        .single();

      if (error) {
        console.log(error)
        throw new Error(error.message);
      }
      return updatedStatus;
    },
    async onSuccess(returnedData) {
      await queryClient.invalidateQueries(['participants', returnedData.user_id, returnedData.workout_id]);
    },
  });
};

export const useAcceptInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error  } = await supabase
        .from('invitations')
        .update({
          invite_status : 'accepted'
        })
        .eq('user_id', data.user_id)
        .eq('workout_id', data.workout_id);

      if (error) {
        console.log(error)
        throw new Error(error.message);
      }

      const { error: participantError } = await supabase.from('participants').insert({
        user_id: data.user_id,
        workout_id: data.workout_id
      });

      if (participantError) {
        console.log(participantError)
        throw new Error(participantError.message);
      }

      return {user_id : data.user_id};
    },
    async onSuccess(returnedData) {
      await queryClient.invalidateQueries(['participants', returnedData?.user_id]);
      await queryClient.invalidateQueries(['invitations', returnedData?.user_id]);
      
    },
  });
};

export const useDeclineInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error } = await supabase
        .from('invitations')
        .update({
          invite_status : 'declined'
        })
        .eq('user_id', data.user_id)
        .eq('workout_id', data.workout_id);

      if (error) {
        console.log(error)
        throw new Error(error.message);
      }

      return {user_id : data.user_id};
    },
    async onSuccess(returnedData) {
      await queryClient.invalidateQueries(['participants', returnedData?.user_id]);
      await queryClient.invalidateQueries(['invitations', returnedData?.user_id]);
      
    },
  });
};


export const updateOldWorkouts = () => {

  const currentTime = new Date().toISOString();
  return useQuery({
    queryKey : ['workouts'], 
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workouts')
        .update({ workout_status: 'past' })
        .lt('end_time', currentTime)
        .neq('workout_status', 'past');


      if (error) 
        throw new Error(error.message);
      return 'updated';
    },
    });
    

};