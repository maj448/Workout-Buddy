// this code is adapted from the code at https://www.reactnativeschool.com/build-a-stop-watch-hook-that-works-even-when-the-app-is-quit
//it is a stopwatch that uses async storage to continue counting when not on the In workout page
import { useState, useRef, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const padStart = (num: number) => {
  return num.toString().padStart(2, "0")
}

const formatMs = (milliseconds: number) => {
  let seconds = Math.floor(milliseconds / 1000)
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)

  // using the modulus operator gets the remainder if the time roles over
  // we don't do this for hours because we want them to rollover
  // seconds = 81 -> minutes = 1, seconds = 21.
  // 60 minutes in an hour, 60 seconds in a minute, 1000 milliseconds in a second.
  minutes = minutes % 60
  seconds = seconds % 60
  // divide the milliseconds by 10 to get the tenths of a second. 543 -> 54
  const ms = Math.floor((milliseconds % 1000) / 10)

  let str = `${padStart(minutes)}:${padStart(seconds)}.${padStart(ms)}`

  if (hours > 0) {
    str = `${padStart(hours)}:${str}`
  }

  return str
}

const ASYNC_KEYS = {
    timeWhenLastStopped: "useStopWatch::timeWhenLastStopped",
    isRunning: "useStopWatch::isRunning",
    startTime: "useStopWatch::startTime",
  }

export const useStopWatch = () => {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [timeWhenLastStopped, setTimeWhenLastStopped] = useState<number>(0)
  const [dataLoaded, setDataLoaded] = useState(false)

  const interval = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    // load data from async storage in case app was quit
  const loadData = async () => {
    try {
      const persistedValues = await AsyncStorage.multiGet([
        ASYNC_KEYS.timeWhenLastStopped,
        ASYNC_KEYS.isRunning,
        ASYNC_KEYS.startTime,
      ])

      const [
        persistedTimeWhenLastStopped,
        persistedIsRunning,
        persistedStartTime,
      ] = persistedValues

      setTimeWhenLastStopped(
        persistedTimeWhenLastStopped[1]
          ? parseInt(persistedTimeWhenLastStopped[1])
          : 0
      )
      setIsRunning(persistedIsRunning[1] === "true")
      setStartTime(
        persistedStartTime[1] ? parseInt(persistedStartTime[1]) : 0
      )
      setDataLoaded(true)
    } catch (e) {
      console.log("error loading persisted data", e)
      setDataLoaded(true)
    }
  }

  loadData()
}, [])

  useEffect(() => {
    // persist the latest data to async storage to be used later, if needed
    const persist = async () => {
      try {
        await AsyncStorage.multiSet([
          [ASYNC_KEYS.timeWhenLastStopped, timeWhenLastStopped.toString()],
          [ASYNC_KEYS.isRunning, isRunning.toString()],
          [ASYNC_KEYS.startTime, startTime.toString()],
        ])
      } catch (e) {
        console.log("error persisting data")
      }
    }

    if (dataLoaded) {
        persist()
      }
    }, [timeWhenLastStopped, isRunning, startTime, dataLoaded])


  useEffect(() => {
    if (startTime > 0) {
      interval.current = setInterval(() => {
        setTime(() => Date.now() - startTime + timeWhenLastStopped)
      }, 1)
    } else {
      if (interval.current) {
        clearInterval(interval.current)
        interval.current = undefined
      }
    }
  }, [startTime])

  const start = () => {
    setIsRunning(true)
    setStartTime(Date.now())
  }

  const stop = () => {
    setIsRunning(false)
    setStartTime(0)
    setTimeWhenLastStopped(time)
  }

  const end = () => {
    setIsRunning(false)
    setStartTime(0)
    setTimeWhenLastStopped(0)
    setTime(0)
  }

  return {
    start,
    stop,
    end,

    isRunning,
    time: formatMs(time),
    dataLoaded,
  }
}