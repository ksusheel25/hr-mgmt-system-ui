import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { attendanceAPI } from '../lib/api'

const AttendanceContext = createContext(null)
const STORAGE_KEY = 'attendance-state'

const loadStoredState = () => {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const persistState = (nextState) => {
  if (typeof window === 'undefined') {
    return
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
  } catch {
    // Ignore storage failures
  }
}

export const AttendanceProvider = ({ children }) => {
  const stored = loadStoredState()
  const [isCheckedIn, setIsCheckedIn] = useState(stored?.isCheckedIn ?? false)
  const [checkInAt, setCheckInAt] = useState(stored?.checkInAt ?? null)
  const [checkOutAt, setCheckOutAt] = useState(stored?.checkOutAt ?? null)
  const [lastSessionSeconds, setLastSessionSeconds] = useState(stored?.lastSessionSeconds ?? 0)
  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    if (stored?.isCheckedIn && stored?.checkInAt) {
      return Math.max(0, Math.floor((Date.now() - stored.checkInAt) / 1000))
    }
    return stored?.lastSessionSeconds ?? 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const intervalRef = useRef(null)

  useEffect(() => {
    persistState({
      isCheckedIn,
      checkInAt,
      checkOutAt,
      lastSessionSeconds,
    })
  }, [isCheckedIn, checkInAt, checkOutAt, lastSessionSeconds])

  useEffect(() => {
    if (!isCheckedIn || !checkInAt) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    setElapsedSeconds(Math.max(0, Math.floor((Date.now() - checkInAt) / 1000)))
    intervalRef.current = setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - checkInAt) / 1000)))
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isCheckedIn, checkInAt])

  const checkIn = useCallback(async (employeeId) => {
    if (!employeeId) {
      setError('Missing employee id for check-in.')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await attendanceAPI.checkIn(employeeId)
      const now = Date.now()
      setIsCheckedIn(true)
      setCheckInAt(now)
      setCheckOutAt(null)
      setElapsedSeconds(0)
    } catch (err) {
      console.error(err)
      setError('Check-in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkOut = useCallback(async (employeeId) => {
    if (!employeeId) {
      setError('Missing employee id for check-out.')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await attendanceAPI.checkOut(employeeId)
      const now = Date.now()
      const sessionSeconds = checkInAt
        ? Math.max(0, Math.floor((now - checkInAt) / 1000))
        : elapsedSeconds
      setIsCheckedIn(false)
      setCheckOutAt(now)
      setLastSessionSeconds(sessionSeconds)
      setElapsedSeconds(sessionSeconds)
    } catch (err) {
      console.error(err)
      setError('Check-out failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [checkInAt, elapsedSeconds])

  const value = useMemo(() => ({
    isCheckedIn,
    checkInAt,
    checkOutAt,
    lastSessionSeconds,
    elapsedSeconds,
    isLoading,
    error,
    checkIn,
    checkOut,
  }), [
    isCheckedIn,
    checkInAt,
    checkOutAt,
    lastSessionSeconds,
    elapsedSeconds,
    isLoading,
    error,
    checkIn,
    checkOut,
  ])

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  )
}

export const useAttendance = () => {
  const context = useContext(AttendanceContext)
  if (!context) {
    throw new Error('useAttendance must be used within AttendanceProvider')
  }
  return context
}
