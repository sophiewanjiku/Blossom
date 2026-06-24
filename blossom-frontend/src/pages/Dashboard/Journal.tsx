import { useState } from 'react'
import { motion } from 'framer-motion'

type MoodOption = 'Joyful' | 'Calm' | 'Tired' | 'Anxious' | 'Irritable' | 'Hopeful'
type EnergyOption = 'High' | 'Medium' | 'Low' | 'Exhausted'
type SleepOption = '8+ hrs' | '6-8 hrs' | '4-6 hrs' | 'Poor'

const MOODS:    MoodOption[]   = ['Joyful', 'Calm', 'Tired', 'Anxious', 'Irritable', 'Hopeful']
const ENERGIES: EnergyOption[] = ['High', 'Medium', 'Low', 'Exhausted']
const SLEEPS:   SleepOption[]  = ['8+ hrs', '6-8 hrs', '4-6 hrs', 'Poor']
const SYMPTOMS = [
  'Cramps', 'Bloating', 'Headache', 'Back pain',
  'Tender breasts', 'Fatigue', 'Nausea', 'Mood swings',
  'Cravings', 'Skin changes', 'Insomnia', 'High energy',
]

export default function Journal() {
  const [mood, setMood]           = useState<MoodOption | null>(null)
  const [energy, setEnergy]       = useState<EnergyOption | null>(null)
  const [sleep, setSleep]         = useState<SleepOption | null>(null)
  const [symptoms, setSymptoms]   = useState<string[]>([])
  const [notes, setNotes]         = useState('')
  const [saved, setSaved]         = useState(false)

  function toggleSymptom(s: string) {
    setSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  function save() {
    // TODO: POST /api/cycles/logs/ in Backend Part 3
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const SectionTitle = ({ children }: { children: string }) => (
    <div style={{
      fontFamily: 'var(--font-ui)', fontSize: 10,
      letterSpacing: 2, textTransform: 'uppercase',
      color: 'var(--text-hint)', marginBottom: 12,
    }}>
      {children}
    </div>
  )

  return (
    <div style={{ padding: '44px 24px 24px' }}>
      <div style={{
        fontFamily: 'var(--font-head)', fontSize: 28,
        color: 'var(--acc2)', fontStyle: 'italic', marginBottom: 4,
      }}>
        Today's journal
      </div>
      <div style={{
        fontFamily: 'var(--font-body)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.6,
      }}>
        Your cycle, your story. Hold it with tenderness.
      </div>

      {/* MOOD */}
      <div style={{ marginBottom: 28 }}>
        <SectionTitle>Mood</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {MOODS.map(m => (
            <motion.button
              key={m}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMood(mood === m ? null : m)}
              style={{
                padding: '8px 16px', borderRadius: 100,
                border: `1px solid ${mood === m ? 'var(--acc1)' : 'var(--card-border)'}`,
                background: mood === m ? 'var(--shine)' : 'transparent',
                color: mood === m ? 'var(--acc1)' : 'var(--text-muted)',
                fontFamily: 'var(--font-ui)', fontSize: 12,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {m}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ENERGY */}
      <div style={{ marginBottom: 28 }}>
        <SectionTitle>Energy</SectionTitle>
        <div style={{ display: 'flex', gap: 8 }}>
          {ENERGIES.map(e => (
            <motion.button
              key={e}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEnergy(energy === e ? null : e)}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: 12,
                border: `1px solid ${energy === e ? 'var(--acc1)' : 'var(--card-border)'}`,
                background: energy === e ? 'var(--shine)' : 'transparent',
                color: energy === e ? 'var(--acc1)' : 'var(--text-muted)',
                fontFamily: 'var(--font-ui)', fontSize: 11,
                cursor: 'pointer', transition: 'all 0.2s',
                textAlign: 'center',
              }}
            >
              {e}
            </motion.button>
          ))}
        </div>
      </div>

      {/* SLEEP */}
      <div style={{ marginBottom: 28 }}>
        <SectionTitle>Sleep</SectionTitle>
        <div style={{ display: 'flex', gap: 8 }}>
          {SLEEPS.map(s => (
            <motion.button
              key={s}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSleep(sleep === s ? null : s)}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: 12,
                border: `1px solid ${sleep === s ? 'var(--acc1)' : 'var(--card-border)'}`,
                background: sleep === s ? 'var(--shine)' : 'transparent',
                color: sleep === s ? 'var(--acc1)' : 'var(--text-muted)',
                fontFamily: 'var(--font-ui)', fontSize: 11,
                cursor: 'pointer', transition: 'all 0.2s',
                textAlign: 'center',
              }}
            >
              {s}
            </motion.button>
          ))}
        </div>
      </div>

      {/* SYMPTOMS */}
      <div style={{ marginBottom: 28 }}>
        <SectionTitle>Symptoms</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SYMPTOMS.map(s => {
            const sel = symptoms.includes(s)
            return (
              <motion.button
                key={s}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSymptom(s)}
                style={{
                  padding: '7px 13px', borderRadius: 100,
                  border: `1px solid ${sel ? 'var(--acc2)' : 'var(--card-border)'}`,
                  background: sel ? 'var(--shine)' : 'transparent',
                  color: sel ? 'var(--acc2)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-ui)', fontSize: 11,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {s}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* NOTES */}
      <div style={{ marginBottom: 28 }}>
        <SectionTitle>Notes</SectionTitle>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Your story begins here..."
          rows={4}
          style={{
            width: '100%',
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            borderRadius: 14, padding: '14px 16px',
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic', fontSize: 14,
            color: 'var(--text)', outline: 'none',
            resize: 'none', lineHeight: 1.7,
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--acc1)'}
          onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
        />
      </div>

      {/* SAVE */}
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={save}
        style={{
          width: '100%', padding: 15, borderRadius: 100,
          background: saved ? 'var(--text-hint)' : 'var(--acc3)',
          border: 'none',
          color: saved ? 'var(--text-muted)' : 'var(--text)',
          fontFamily: 'var(--font-head)', fontSize: 15,
          fontWeight: 400, cursor: 'pointer',
          letterSpacing: 0.5, transition: 'all 0.4s',
        }}
      >
        {saved ? 'Saved with care ✦' : 'Save today\'s entry'}
      </motion.button>
    </div>
  )
}