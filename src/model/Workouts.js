import { Model } from '@nozbe/watermelondb'
import { field, text, date, children} from '@nozbe/watermelondb/decorators'

export default class Workout extends Model {
  static table = 'workouts'
  static associations = {
    invitations: { type: 'has_many', foreignKey: 'workout_id' },
  }

  @text('title') title
  @text('notes') notes
  @date('workout_date') workoutDate
  @date('start_time') startTime
  @date('end_time') endTime
  @field('duration') duration
  @field('activity') activity
  @field('workout_status') workoutStatus
  @field('checked_in') checkedIn

  @children('invitations') comments
}