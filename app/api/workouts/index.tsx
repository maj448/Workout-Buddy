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
    }



    },
    async onSuccess() {
      queryClient.invalidateQueries(['participants', data.user_id]);
      queryClient.invalidateQueries(['workouts', { workoutIds: data.workout_id }]);
    },
    onError(error) {
      //console.log(error);
    },
  });

};
