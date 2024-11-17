
import {SafeAreaView} from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { format, parseISO} from 'date-fns';

import * as SQLite from 'expo-sqlite'
import {useState, useEffect} from 'react';


export default function Index() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(today);
  
  const displayDate = format(parseISO(selected), 'MMM dd');
    useEffect(() => {
      // Create an async function to handle the database logic
      const initDatabase = async () => {
        try {
          // Open the database
          const db = await SQLite.openDatabaseAsync('WorkoutBuddyDB');
  
          // Set up the database schema and insert some initial data
          await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
            INSERT INTO test (value, intValue) VALUES ('test1', 123);
            INSERT INTO test (value, intValue) VALUES ('test2', 456);
            INSERT INTO test (value, intValue) VALUES ('test3', 789);
          `);
  
          // Insert new record
          const result = await db.runAsync('INSERT INTO test (value, intValue) VALUES (?, ?)', ['aaa', 100]);
          console.log(result.lastInsertRowId, result.changes);
  
          // Update a record
          await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', [999, 'aaa']);
          
          // Delete a record
          await db.runAsync('DELETE FROM test WHERE value = $value', { $value: 'aaa' });
  
          // Fetch all rows from the table
          const allRows = await db.getAllAsync('SELECT * FROM test');
          setRows(allRows);  // Update the state with fetched rows
  
        } catch (error) {
          console.error('Database error: ', error);
        }
      };
  
      // Call the async function
      initDatabase();
    }, []); // Empty dependency array to run this only on component mount
  
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

      </SafeAreaView>
    );
  }