
import {SafeAreaView} from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { format, parseISO} from 'date-fns';
import WorkoutList from "./WorkoutList"

// import * as SQLite from 'expo-sqlite'
import {useState, useEffect} from 'react';

type Task = {
  id: number;
  title: string;
  notes: string;
  workout_date: string;
  start_time: string;
  end_time: string;
};

type Props = {
  task: Task;
};

export default function Index() {

  const [users, setUsers] = useState([
    { 
      id: 1, 
      username: 'Alice', 
      email: 'alice@example.com', 
      password_hash: 'hashed_password_1' 
    },
    { 
      id: 2, 
      username: 'Bob', 
      email: 'bob@example.com', 
      password_hash: 'hashed_password_2' 
    },
    { 
      id: 3, 
      username: 'Charlie', 
      email: 'charlie@example.com', 
      password_hash: 'hashed_password_3' 
    },
    { 
      id: 4, 
      username: 'David', 
      email: 'david@example.com', 
      password_hash: 'hashed_password_4' 
    },
    { 
      id: 5, 
      username: 'Eve', 
      email: 'eve@example.com', 
      password_hash: 'hashed_password_5' 
    }
  ]);
  
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Morning Run', 
      notes: 'A 5km run around the park.', 
      workout_date: '2024-11-17T07:00:00Z', 
      start_time: '2024-11-17T07:00:00Z',
      end_time: '2024-11-17T08:00:00Z' 
    },
    { 
      id: 2,
      title: 'Yoga Session', 
      notes: 'Morning yoga for flexibility.', 
      workout_date: '2024-11-18T08:00:00Z',  
      start_time: '2024-11-18T08:00:00Z',
      end_time: '2024-11-18T09:00:00Z'
    },
    { 
      id: 3, 
      title: 'Evening Cycling', 
      notes: 'A scenic cycling route around the lake.', 
      workout_date: '2024-11-17T18:00:00Z',
      start_time: '2024-11-17T18:00:00Z',
      end_time: '2024-11-17T19:30:00Z'
    }
  ]);

  const [invitations, setInvitations] = useState([
    { 
      id: 1, 
      workout_id: 1, 
      inviter_id: 1, 
      invitee_id: 2, 
      status: 'pending' 
    },  // Alice invites Bob to her workout
    { 
      id: 2, 
      workout_id: 1, 
      inviter_id: 1, 
      invitee_id: 3, 
      status: 'accepted' 
    },  // Alice invites Charlie to her workout, Charlie accepts
    { 
      id: 3, 
      workout_id: 2, 
      inviter_id: 2, 
      invitee_id: 3, 
      status: 'pending' 
    },  // Bob invites Charlie to his workout
    { 
      id: 4, 
      workout_id: 3, 
      inviter_id: 3, 
      invitee_id: 4, 
      status: 'pending' 
    },  
    { 
      id: 5, 
      workout_id: 3, 
      inviter_id: 3, 
      invitee_id: 5, 
      status: 'accepted' 
    }   // Charlie invites Eve to his workout, Eve accepts
  ]);

  const [buddies, setBuddies] = useState([
    { 
      id: 1, 
      user_id: 1, 
      friend_id: 2, 
      status: 'accepted' },  // Alice and Bob are friends
    { 
      id: 2, 
      user_id: 1, 
      friend_id: 3, 
      status: 'accepted' },  // Alice and Charlie are friends
    { 
      id: 3, 
      user_id: 2, 
      friend_id: 3, 
      status: 'pending' },   // Bob sent a friend request to Charlie (pending)
    { 
      id: 4, 
      user_id: 4, 
      friend_id: 5, 
      status: 'pending' }   // David and Eve's friend request was rejected
  ]);

  const today = format(new Date(), 'yyyy-MM-dd');
  //const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(today);

  const filteredTasks = tasks.filter(task => {
    const taskDate = task.workout_date.split('T')[0];
    return taskDate === selected;
  });
  
  const displayDate = format(parseISO(selected), 'MMM dd');
    // useEffect(() => {
    //   // Create an async function to handle the database logic
    //   const initDatabase = async () => {
    //     try {
    //       // Open the database
    //       const db = await SQLite.openDatabaseAsync('WorkoutBuddyDB');
  
    //       // Set up the database schema and insert some initial data
    //       await db.execAsync(`
    //         PRAGMA journal_mode = WAL;
    //         CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
    //         INSERT INTO test (value, intValue) VALUES ('test1', 123);
    //         INSERT INTO test (value, intValue) VALUES ('test2', 456);
    //         INSERT INTO test (value, intValue) VALUES ('test3', 789);
    //       `);
  
    //       // Insert new record
    //       const result = await db.runAsync('INSERT INTO test (value, intValue) VALUES (?, ?)', ['aaa', 100]);
    //       console.log(result.lastInsertRowId, result.changes);
  
    //       // Update a record
    //       await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', [999, 'aaa']);
          
    //       // Delete a record
    //       await db.runAsync('DELETE FROM test WHERE value = $value', { $value: 'aaa' });
  
    //       // Fetch all rows from the table
    //       const allRows = await db.getAllAsync('SELECT * FROM test');
    //       setRows(allRows);  // Update the state with fetched rows
  
    //     } catch (error) {
    //       console.error('Database error: ', error);
    //     }
    //   };
  
    //   // Call the async function
    //   initDatabase();
    // }, []); // Empty dependency array to run this only on component mount
  
    return (
      <SafeAreaView>
        {/* <Text>Database Rows:</Text>
        <ScrollView>
          {rows.map((row) => (
            <View key={row.id}>
              <Text>{`ID: ${row.id}, Value: ${row.value}, intValue: ${row.intValue}`}</Text>
            </View>
          ))}
        </ScrollView> */}
        <Calendar
      onDayPress={day => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {
          selected: true, 
          disableTouchEvent: true, 
          selectedDotColor: 'orange'}
      }}
      enableSwipeMonths={true}

    />
    <Text>{displayDate}</Text>
    <WorkoutList tasks={filteredTasks}/>

    </SafeAreaView>
    );
  }