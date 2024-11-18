import { Model } from '@nozbe/watermelondb'
import { field, text, relation, date, children} from '@nozbe/watermelondb/decorators'


export default class Buddy extends Model {
  static table = 'buddies'
  static associations = {
    user: { type: 'belongs_to', foreignKey: 'user_id' },
    user: { type: 'belongs_to', foreignKey: 'buddy_user_id' },
  }

  @field('user_id') userId
  @field('buddy_user_id') buddyUserId
  @text('buddy_status') buddyStatus

  @relation('users', 'user_id') user
}