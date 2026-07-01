import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { cycleApi } from '../lib/api'

export interface CalendarDay {
  date:      string   // 'YYYY-MM-DD'
  day_type:  string   // 'period' | 'fertile' | 'ovulation' | 'predicted' | 'normal'
  cycle_day: number
}

export function useCalendar(year: number, month: number) {
  const [days, setDays]       = useState<CalendarDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    cycleApi.getCalendar(year, month)
      .then(res => setDays(res.data))
      .catch(() => setDays([]))
      .finally(() => setLoading(false))
  }, [year, month])

  // Convert array to a map keyed by day number for easy lookup
  // { 1: 'period', 14: 'ovulation', ... }
  const dayTypeMap: Record<number, string> = {}
  days.forEach(d => {
    const dayNum = dayjs(d.date).date()
    dayTypeMap[dayNum] = d.day_type
  })

  return { days, dayTypeMap, loading }
}