import { useState } from 'react'
import { motion } from 'framer-motion'
import { useThemeStore } from '../../store/index'
import { THEMES } from '../../themes/themes'
import dayjs from 'dayjs'

// Cycle phase logic — pure algorithm, no library needed
function getCyclePhase(dayOfCycle: number): {
  name: string
  days: string
  poetry: string
  progress: number
} {
  if (dayOfCycle <= 5)  return { name: 'Menstrual',   days: 'Days 1–5',   poetry: '', progress: (dayOfCycle / 28) * 100 }
  if (dayOfCycle <= 13) return { name: 'Follicular',  days: 'Days 6–13',  poetry: '', progress: (dayOfCycle / 28) * 100 }
  if (dayOfCycle === 14) return { name: 'Ovulation',  days: 'Day 14',     poetry: '', progress: 50 }
  return                       { name: 'Luteal',      days: 'Days 15–28', poetry: '', progress: (dayOfCycle / 28) * 100 }
}

const SYMPTOMS = [
  'Cramps', 'Bloating', 'Headache', 'High energy',
  'Fatigue', 'Mood swings', 'Cravings', 'Tender breasts',
  'Insomnia', 'Glowing skin', 'Back pain', 'Nausea',
]

const FLOW_LEVELS = ['Spotting', 'Light', 'Medium', 'Heavy']

export default function Tracker() {
  const { themeId } = useThemeStore()
  const theme       = THEMES[themeId]

  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [flow, setFlow] = useState('Light')
  const [saved, setSaved] = useState(false)

  // Hardcoded cycle data for now — replaced with API in Backend Part 3
  const PERIOD_DAYS  = [1, 2, 3, 4, 5]
  const FERTILE_DAYS = [11, 12, 13, 15, 16]
  const OV_DAY       = 14
  const TODAY        = 27  // day of current month
  const CYCLE_DAY    = 14

  const phase = getCyclePhase(CYCLE_DAY)
  // Get the correct poem for current phase from theme config
  phase.poetry = theme.phasePoetry[
    CYCLE_DAY <= 5  ? 'menstrual'  :
    CYCLE_DAY <= 13 ? 'follicular' :
    CYCLE_DAY === 14 ? 'ovulation' : 'luteal'
  ]

  // Build calendar days
  const firstDayOfMonth = currentMonth.startOf('month').day() // 0=Sun
  const daysInMonth     = currentMonth.daysInMonth()
  const emptySlots      = Array(firstDayOfMonth).fill(null)
  const dayNumbers      = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  function getDayStyle(day: number) {
    const isToday    = currentMonth.month() === dayjs().month() && day === TODAY
    const isPeriod   = PERIOD_DAYS.includes(day)
    const isFertile  = FERTILE_DAYS.includes(day)
    const isOvulation = day === OV_DAY

    if (isOvulation) return { bg: 'var(--acc1)', color: 'var(--bg1)', fw: 700 }
    if (isPeriod)    return { bg: 'var(--acc3)', color: '#fff', fw: 500 }
    if (isFertile)   return { bg: 'var(--shine)', color: 'var(--acc1)', fw: 400 }
    if (isToday)     return { bg: 'var(--shine)', color: 'var(--acc2)', fw: 600 }
    return { bg: 'transparent', color: 'var(--text-muted)', fw: 400 }
  }

  function toggleSymptom(s: string) {
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  function saveLog() {
    // TODO: POST /api/cycles/logs/ in Backend Part 3
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div>
      {/* Phase banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--card-border)',
          borderRadius: 16, padding: '20px 24px',
          marginBottom: 20, position: 'relative', overflow: 'hidden',
        }}
      >
        {/* decorative circle */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'var(--shine)', pointerEvents: 'none',
        }} />

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', flexWrap: 'wrap', gap: 12,
          position: 'relative',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-head)', fontSize: 28,
              fontWeight: 700, color: 'var(--acc2)',
              letterSpacing: 1, lineHeight: 1,
            }}>
              {phase.name} Phase
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: 10,
              color: 'var(--text-hint)', letterSpacing: 1,
              textTransform: 'uppercase', marginTop: 4,
            }}>
              {phase.days} · Cycle day {CYCLE_DAY}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontStyle: 'italic',
              fontSize: 13, color: 'var(--text-muted)',
              marginTop: 10, lineHeight: 1.7, maxWidth: 320,
            }}>
              {phase.poetry}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: 'var(--font-head)', fontSize: 44,
              color: 'var(--gold)', lineHeight: 1,
            }}>
              14
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: 9,
              color: 'var(--text-hint)', letterSpacing: 1.5,
              textTransform: 'uppercase', marginTop: 4,
            }}>
              days until next
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          marginTop: 18, height: 3,
          background: 'rgba(148,210,255,0.1)',
          borderRadius: 100, overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${phase.progress}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{
              height: '100%', background: 'var(--acc1)',
              borderRadius: 100,
            }}
          />
        </div>
      </motion.div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--card-border)',
          borderRadius: 14, padding: 20, marginBottom: 18,
        }}
      >
        {/* Month navigation */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 16,
        }}>
          <button
            onClick={() => setCurrentMonth(m => m.subtract(1, 'month'))}
            style={{
              background: 'none', border: '1px solid var(--card-border)',
              borderRadius: 8, width: 30, height: 30, cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: 16,
            }}
          >
            ‹
          </button>
          <span style={{
            fontFamily: 'var(--font-head)', fontSize: 16,
            color: 'var(--acc2)',
          }}>
            {currentMonth.format('MMMM YYYY')}
          </span>
          <button
            onClick={() => setCurrentMonth(m => m.add(1, 'month'))}
            style={{
              background: 'none', border: '1px solid var(--card-border)',
              borderRadius: 8, width: 30, height: 30, cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: 16,
            }}
          >
            ›
          </button>
        </div>

        {/* Day of week headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center', marginBottom: 8,
        }}>
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <span key={d} style={{
              fontFamily: 'var(--font-ui)', fontSize: 10,
              color: 'var(--text-hint)', letterSpacing: 1,
              textTransform: 'uppercase', padding: '4px 0',
            }}>
              {d}
            </span>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
          {emptySlots.map((_, i) => <div key={`e${i}`} />)}
          {dayNumbers.map(day => {
            const s = getDayStyle(day)
            return (
              <div
                key={day}
                style={{
                  height: 36, borderRadius: '50%',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-body)', fontSize: 13,
                  background: s.bg, color: s.color,
                  fontWeight: s.fw, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {day}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 12,
          marginTop: 16, paddingTop: 16,
          borderTop: '1px solid var(--card-border)',
        }}>
          {[
            { color: 'var(--acc3)', label: 'Period' },
            { color: 'var(--acc1)', label: 'Ovulation' },
            { color: 'var(--shine)', border: 'var(--acc1)', label: 'Fertile' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: l.color,
                border: l.border ? `1px solid ${l.border}` : undefined,
              }} />
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: 11,
                color: 'var(--text-muted)',
              }}>
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily log */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--card-border)',
          borderRadius: 14, padding: 20,
        }}
      >
        {/* Flow */}
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 10,
          letterSpacing: 1.5, textTransform: 'uppercase',
          color: 'var(--text-hint)', marginBottom: 10,
        }}>
          Flow today
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {FLOW_LEVELS.map(f => (
            <button
              key={f}
              onClick={() => setFlow(f)}
              style={{
                flex: 1, minWidth: 70, padding: '9px 8px',
                borderRadius: 8, border: `1px solid ${flow === f ? 'var(--acc1)' : 'var(--card-border)'}`,
                background: flow === f ? 'var(--shine)' : 'transparent',
                color: flow === f ? 'var(--acc1)' : 'var(--text-muted)',
                fontFamily: 'var(--font-head)', fontSize: 10,
                letterSpacing: 1, cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Symptoms */}
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 10,
          letterSpacing: 1.5, textTransform: 'uppercase',
          color: 'var(--text-hint)', marginBottom: 10,
        }}>
          Symptoms
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {SYMPTOMS.map(s => {
            const sel = selectedSymptoms.includes(s)
            return (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                style={{
                  padding: '6px 13px', borderRadius: 100,
                  border: `1px solid ${sel ? 'var(--acc2)' : 'var(--card-border)'}`,
                  background: sel ? 'var(--shine)' : 'transparent',
                  color: sel ? 'var(--acc2)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-ui)', fontSize: 11,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {s}
              </button>
            )
          })}
        </div>

        {/* Save button */}
        <button
          onClick={saveLog}
          style={{
            width: '100%', padding: 13, borderRadius: 10,
            background: 'transparent',
            border: `1px solid ${saved ? 'var(--acc2)' : 'var(--acc1)'}`,
            color: saved ? 'var(--acc2)' : 'var(--acc1)',
            fontFamily: 'var(--font-head)', fontSize: 11,
            letterSpacing: 2, textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.3s',
          }}
        >
          {saved ? 'Saved ✦' : 'Save today\'s log'}
        </button>
      </motion.div>
    </div>
  )
}