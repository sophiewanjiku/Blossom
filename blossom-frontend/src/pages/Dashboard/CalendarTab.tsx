import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import { useCalendar } from '../../hooks/useCalendar'

export default function CalendarTab() {
  const [current, setCurrent]   = useState(dayjs())
  const [selected, setSelected] = useState<number | null>(null)

  const year  = current.year()
  const month = current.month() + 1  // dayjs months are 0-indexed, API expects 1-indexed

  // ---- REAL DATA from the calendar API ----
  const { dayTypeMap, loading } = useCalendar(year, month)

  const firstDay    = current.startOf('month').day()
  const daysInMonth = current.daysInMonth()
  const today       = dayjs()
  const isThisMonth = current.month() === today.month() && current.year() === today.year()

  function getDayType(day: number): string {
    if (isThisMonth && day === today.date()) return 'today'
    return dayTypeMap[day] ?? 'normal'
  }

  function getDayStyle(type: string, isSelected: boolean): React.CSSProperties {
    const base: React.CSSProperties = {
      aspectRatio: '1 / 1',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      fontWeight: 300,
      cursor: 'pointer',
      transition: 'all 0.15s',
      border: 'none',
      background: 'transparent',
      color: 'var(--text-muted)',
    }

    if (isSelected) return {
      ...base,
      background: 'var(--shine)',
      border: '1px solid var(--acc1)',
      color: 'var(--acc1)',
      fontWeight: 500,
    }

    switch (type) {
      case 'period':    return { ...base, background: 'var(--acc3)',  color: '#fff', fontWeight: 400 }
      case 'predicted': return { ...base, border: '1.5px solid var(--acc3)', color: 'var(--acc1)' }
      case 'ovulation': return { ...base, boxShadow: '0 0 0 2px var(--gold)', color: 'var(--gold)', fontWeight: 500 }
      case 'today':     return { ...base, boxShadow: '0 0 0 1.5px var(--acc1)', color: 'var(--acc1)', fontWeight: 500 }
      case 'fertile':   return { ...base, color: 'var(--acc2)', opacity: 0.75 }
      default:          return base
    }
  }

  function getDayDetail(day: number): string {
    const type = getDayType(day)
    const dateStr = current.date(day).format('MMMM D')
    switch (type) {
      case 'period':    return `${dateStr} — Menstrual phase. Rest and restore.`
      case 'ovulation': return `${dateStr} — Ovulation day. Peak fertility window.`
      case 'fertile':   return `${dateStr} — Fertile window. Conception is possible.`
      case 'predicted': return `${dateStr} — Predicted period start. Prepare gently.`
      case 'today':     return `${dateStr} — Today. You are here.`
      default:          return `${dateStr} — Tap to log how you felt this day.`
    }
  }

  const LEGEND = [
    { label: 'Period',    style: { background: 'var(--acc3)' } },
    { label: 'Predicted', style: { border: '1.5px solid var(--acc3)', background: 'transparent' } },
    { label: 'Ovulation', style: { boxShadow: '0 0 0 2px var(--gold)', background: 'transparent' } },
    { label: 'Fertile',   style: { background: 'var(--acc2)', opacity: 0.6 } },
    { label: 'Today',     style: { boxShadow: '0 0 0 1.5px var(--acc1)', background: 'transparent' } },
  ]

  return (
    <div style={{ padding: '44px 24px 24px' }}>
      <div style={{
        fontFamily: 'var(--font-head)', fontSize: 28,
        color: 'var(--acc2)', fontStyle: 'italic', marginBottom: 4,
      }}>
        Your calendar
      </div>
      <div style={{
        fontFamily: 'var(--font-body)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--text-muted)', marginBottom: 28,
      }}>
        Every phase, every day, held with care.
      </div>

      {/* Month navigation */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 24,
      }}>
        <button
          onClick={() => {
            setCurrent(c => c.subtract(1, 'month'))
            setSelected(null)
          }}
          style={{
            background: 'none',
            border: '1px solid var(--card-border)',
            borderRadius: '50%', width: 34, height: 34,
            cursor: 'pointer', color: 'var(--text-muted)',
            fontSize: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          ‹
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.format('YYYY-MM')}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              fontFamily: 'var(--font-head)', fontSize: 20,
              color: 'var(--acc2)', fontStyle: 'italic',
            }}
          >
            {current.format('MMMM YYYY')}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => {
            setCurrent(c => c.add(1, 'month'))
            setSelected(null)
          }}
          style={{
            background: 'none',
            border: '1px solid var(--card-border)',
            borderRadius: '50%', width: 34, height: 34,
            cursor: 'pointer', color: 'var(--text-muted)',
            fontSize: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          ›
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4, marginBottom: 16,
        }}>
          {Array(35).fill(null).map((_, i) => (
            <div key={i} style={{
              aspectRatio: '1 / 1', borderRadius: '50%',
              background: 'var(--shine)',
              animation: 'pulse 1.5s infinite',
            }} />
          ))}
        </div>
      )}

      {/* Day of week headers */}
      {!loading && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center', marginBottom: 10,
          }}>
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <span key={d} style={{
                fontFamily: 'var(--font-ui)', fontSize: 10,
                color: 'var(--text-hint)', letterSpacing: 0.5,
                textTransform: 'uppercase', padding: '4px 0',
              }}>
                {d}
              </span>
            ))}
          </div>

          {/* Day cells */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 4,
          }}>
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`e${i}`} style={{ aspectRatio: '1 / 1' }} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const type  = getDayType(day)
              const isSel = selected === day
              return (
                <motion.button
                  key={day}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setSelected(isSel ? null : day)}
                  style={getDayStyle(type, isSel)}
                >
                  {day}
                </motion.button>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 12,
            marginTop: 20, paddingTop: 20,
            borderTop: '1px solid var(--card-border)',
          }}>
            {LEGEND.map(l => (
              <div key={l.label} style={{
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  flexShrink: 0, ...l.style,
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

          {/* Selected day detail */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                style={{
                  marginTop: 20,
                  background: 'var(--card)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 16, padding: 18, overflow: 'hidden',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-head)', fontSize: 16,
                  color: 'var(--acc2)', marginBottom: 6,
                }}>
                  {current.date(selected).format('MMMM D, YYYY')}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontStyle: 'italic',
                  fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
                }}>
                  {getDayDetail(selected)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}