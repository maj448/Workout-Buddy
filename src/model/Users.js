import { Model } from '@nozbe/watermelondb'
import { field, text, date, children} from '@nozbe/watermelondb/decorators'

export default class User extends Model {
  static table = 'users'
  static associations = {
    invitations: { type: 'has_one', foreignKey: 'from_user_id' },
    invitations: { type: 'has_many', foreignKey: 'to_user_id' },
    buddies: { type: 'has_one', foreignKey: 'user_id' },
    buddies: { type: 'has_many', foreignKey: 'buddy_user_id' },
  }

  @text('username') username
  @text('email') email

  @children('invitations') invitations
  @children('buddies', 'buddy_user_id') buddies
}