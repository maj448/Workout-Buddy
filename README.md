# Workout Buddy

This is an [Expo](https://expo.dev) project that uses Supabase as a database.

It was only tested on Android devices and within Expo Go and Expo Development build.

## To run
Download the project and build with 'npx expo run:android' or 'eas build --platform android'.

Install the application on a physical device or android device.

Then run 'npx expo start' and run the build on the installed app.

*Notifications do not work consistently but to even have a chance to work it needs to be run on a physical device.
The Pedometer also requires a physical device to work.

## Description

Workout Buddy is a workout scheduling application that allows users to schedule workouts with buddies they will not be able to perform the workout with in person.
It allows users to invite buddies to workouts and then during the workout see which buddies are also present for the workout

## Functionalities

- Sign Up 
- Login
- Add or update a profile picture 
- Add buddies
- Create a workout 
- View a past, present, upcoming, or invited workout
- Accept or decline invites to workouts 
- Invite buddies to workouts
- Delete a workout or Buddy
- Check in or leave being checked in
- Start a workout and start and pause the stopwatch (a started stopwatch will continue counting with the page left and/ or phone turned off until the workout is ended)
- View a buddies completed workout duration and activity

## Quick Actions
- A workout can quickly be created on a date by long pressing on the date on the calendar if the date is not already selected (selected dates must use the + button)
- Swipe left and right on the calendar to change months
- Swipe left and right on the area under the calendar to change the day 
- Swipe down on the Home, Buddies, and Workout Details pages to refresh the information from the database

## Resources Used 

- react-native-element-dropdown
- expo-notifications
- react-native-gesture-handler
- react-native-safe-area-context
- react-native-calendars
- @tanstack/react-query
- @react-navigation/native
- @expo/vector-icons/AntDesign
- @expo/vector-icons/Ionicons
- @supabase/supabase-js
- @react-native-community/datetimepicker
- https://www.reactnativeschool.com/build-a-stop-watch-hook-that-works-even-when-the-app-is-quit
- https://notjust.notion.site/React-Native-Supabase-Masterclass-47a69a60bc464c399b5a0df4d3c4a630

