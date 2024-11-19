import { schemaMigrations, createTable } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
    migrations: [
      {
        // ⚠️ Set this to a number one larger than the current schema version
        toVersion: 2,
        steps: [
          // See "Migrations API" for more details
          createTable({
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
              { name: 'checked_in', type: 'boolean' },
            ],
          }),
        ],
      },
    ],
  })