import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default mySchema = appSchema({
    version: 1,
    tables: [
      tableSchema({
        name: 'workouts',
        columns: [
          { name: 'title', type: 'string' },
          { name: 'notes', type: 'string', isOptional: true },
          { name: 'workout_date', type: 'number' },
          { name: 'start_time', type: 'number' },
          { name: 'end_time', type: 'number' },
          { name: 'duration', type: 'number', isOptional: true },
          { name: 'activity', type: 'string', isOptional: true },
          { name: 'workout_status', type: 'string' },
        ]
      }),

      tableSchema({
        name: 'users',
        columns: [
          { name: 'username', type: 'string' },
          { name: 'email', type: 'string' },

        ],
      }),

      tableSchema({
        name: 'invitations',
        columns: [
          { name: 'workout_id', type: 'string'},
          { name: 'from_user_id', type: 'string' },
          { name: 'to_user_id', type: 'string' },
          { name: 'invite_status', type: 'string' },
        ],
      }),

      tableSchema({
        name: 'buddies',
        columns: [
          { name: 'user_id', type: 'string' },
          { name: 'buddy_user_id', type: 'string' },
          { name: 'buddy_status', type: 'string' },
        ],
      }),

    ]
  })