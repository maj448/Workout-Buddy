import { Model } from '@nozbe/watermelondb'
import { field, text, relation, date, children} from '@nozbe/watermelondb/decorators'

export default class Invitation extends Model {
  static table = 'invitations'
  static associations = {
    workouts: { type: 'belongs_to', foreignKey: 'workout_id' },
    users: { type: 'belongs_to', foreignKey: 'from_user_id' },
    users: { type: 'belongs_to', foreignKey: 'to_user_id' },

  }

  @field('workout_id') WorkoutId
  @field('from_user_id') fromUserId
  @field('to_user_id') ToUserId
  @text('invite_status') inviteStatus

  @relation('users', 'from_user_id') user
 
}