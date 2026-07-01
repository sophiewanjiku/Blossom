import { useState, useEffect } from 'react'
import { cycleApi } from '../lib/api'

export interface Prediction {
  current_day:       number
  total_days:        number
  phase:             string
  phase_name:        string
  phase_day:         number
  days_until_period: number
  next_period_date:  string | null
  ovulation_date:    string | null
  fertile_start:     string | null
  fertile_end:       string | null
  is_fertile_now:    boolean
  cycle_length:      number
  period_length:     number
  no_data?:          boolean
}

// Default values shown while loading or when no data exists yet
const DEFAULT_PREDICTION: Prediction = {
  current_day:       1,
  total_days:        28,
  phase:             'menstrual',
  phase_name:        'Menstrual Phase',
  phase_day:         1,
  days_until_period: 28,
  next_period_date:  null,
  ovulation_date:    null,
  fertile_start:     null,
  fertile_end:       null,
  is_fertile_now:    false,
  cycle_length:      28,
  period_length:     5,
  no_data:           true,
}

export function usePrediction() {
  const [prediction, setPrediction] = useState<Prediction>(DEFAULT_PREDICTION)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)

  useEffect(() => {
    cycleApi.getPrediction()
      .then(res => {
        setPrediction(res.data)
        setError(null)
      })
      .catch(() => {
        // Backend not running — keep defaults, don't crash
        setError('Could not load cycle data.')
      })
      .finally(() => setLoading(false))
  }, [])

  return { prediction, loading, error }
}