import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../../store/index'
import { THEMES, THEME_ORDER, type ThemeId } from '../../themes/themes'
import { authApi } from '../../lib/api'

// ============================================================
// These components are defined OUTSIDE Onboarding so React
// doesn't recreate them on every render
// ============================================================

const ProgressBar = ({ step }: { step: number }) => (
  <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
    {[1, 2, 3].map(s => (
      <div key={s} style={{
        flex: 1, height: 3, borderRadius: 2,
        background: s <= step
          ? 'var(--acc1)'
          : 'rgba(148,210,255,0.1)',
        transition: 'background 0.5s',
      }} />
    ))}
  </div>
)

const SkipRow = ({
  onSkip,
  label = 'Complete this later under Profile',
}: {
  onSkip: () => void
  label?: string
}) => (
  <div style={{
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginTop: 16,
  }}>
    <span style={{
      fontFamily: 'var(--font-ui)', fontSize: 11,
      color: 'var(--text-hint)',
    }}>
      {label}
    </span>
    <button
      onClick={onSkip}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: 'var(--font-ui)', fontSize: 12,
        color: 'var(--text-muted)',
        textDecoration: 'underline', textUnderlineOffset: 3,
      }}
    >
      Skip →
    </button>
  </div>
)

// ============================================================
// Health conditions list
// ============================================================

const HEALTH_CONDITIONS = [
  'Endometriosis', 'PCOS', 'Uterine fibroids', 'Adenomyosis',
  'Thyroid issues', 'Ovarian cysts', 'Premature ovarian insufficiency',
  'Cervical conditions', 'Trying to conceive', 'Irregular cycles',
  'Menopause / perimenopause', 'None of the above',
]

// ============================================================
// Shared input label style — reused across all fields
// ============================================================

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-ui)',
  fontSize: 10,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--text-hint)',
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--card)',
  border: '1px solid var(--card-border)',
  borderRadius: 10,
  padding: '11px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  color: 'var(--text)',
  outline: 'none',
  colorScheme: 'dark' as const,
}

const hintStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-hint)',
  marginTop: 4,
  fontFamily: 'var(--font-ui)',
}

const primaryBtn: React.CSSProperties = {
  width: '100%',
  padding: '13px',
  borderRadius: 10,
  background: 'transparent',
  border: '1px solid var(--acc1)',
  color: 'var(--acc1)',
  fontFamily: 'var(--font-head)',
  fontSize: 11,
  letterSpacing: 2,
  textTransform: 'uppercase' as const,
  cursor: 'pointer',
  transition: 'all 0.25s',
}

// ============================================================
// ONBOARDING COMPONENT
// ============================================================

type Step = 1 | 2 | 3

export default function Onboarding() {
  const navigate        = useNavigate()
  const { setTheme }    = useThemeStore()

  const [step, setStep] = useState<Step>(1)

  // Step 1 fields
  const [dob, setDob]             = useState('')
  const [cycleLen, setCycleLen]   = useState('28')
  const [lastPeriod, setLastPeriod] = useState('')

  // Step 2 fields
  const [conditions, setConditions] = useState<string[]>([])

  // Step 3 fields
  const [chosenTheme, setChosenTheme] = useState<ThemeId>('frozen')

  const [loading, setLoading] = useState(false)

  function toggleCondition(c: string) {
    setConditions(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    )
  }

  async function finish() {
    setLoading(true)
    try {
      await authApi.updateOnboarding({
        date_of_birth:       dob || undefined,
        cycle_length:        parseInt(cycleLen) || 28,
        last_period_date:    lastPeriod || undefined,
        health_conditions:   conditions,
        theme:               chosenTheme,
        onboarding_complete: true,
      })
      setTheme(chosenTheme)
      navigate('/app/tracker')
    } catch  {
      // If API fails (backend not running yet), still navigate
      setTheme(chosenTheme)
      navigate('/app/tracker')
    } finally {
      setLoading(false)
    }
  }

  // ---- STEP 1: Personal info ----
  if (step === 1) return (
    <div>
      <ProgressBar step={1} />

      <h1 style={{
        fontFamily: 'var(--font-head)', fontSize: 24,
        fontWeight: 700, color: 'var(--acc2)',
        letterSpacing: 1, marginBottom: 6,
      }}>
        Tell us about you
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--text-muted)',
        marginBottom: 28, lineHeight: 1.6,
      }}>
        This helps Blossom personalise your experience.
        You can update this anytime.
      </p>

      {/* Date of birth */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Date of birth</label>
        <input
          type="date"
          value={dob}
          onChange={e => setDob(e.target.value)}
          style={inputStyle}
        />
        <p style={hintStyle}>
          Used to calculate age-relevant health information.
        </p>
      </div>

      {/* Cycle length */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>
          Average cycle length (days)
        </label>
        <input
          type="number"
          min={21}
          max={45}
          value={cycleLen}
          onChange={e => setCycleLen(e.target.value)}
          style={inputStyle}
        />
        <p style={hintStyle}>
          Don't know? 28 is a good starting estimate.
        </p>
      </div>

      {/* Last period */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Last period start date</label>
        <input
          type="date"
          value={lastPeriod}
          onChange={e => setLastPeriod(e.target.value)}
          style={inputStyle}
        />
      </div>

      <button
        style={primaryBtn}
        onClick={() => setStep(2)}
      >
        Continue
      </button>

      <SkipRow onSkip={() => setStep(3)} />
    </div>
  )

  // ---- STEP 2: Health conditions ----
  if (step === 2) return (
    <div>
      <ProgressBar step={2} />

      <h1 style={{
        fontFamily: 'var(--font-head)', fontSize: 24,
        fontWeight: 700, color: 'var(--acc2)',
        letterSpacing: 1, marginBottom: 6,
      }}>
        Health awareness
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--text-muted)',
        marginBottom: 24, lineHeight: 1.6,
      }}>
        Select any conditions you've been diagnosed with or want
        to learn more about. This is private and entirely optional.
      </p>

      {/* Condition tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {HEALTH_CONDITIONS.map(c => {
          const selected = conditions.includes(c)
          return (
            <button
              key={c}
              onClick={() => toggleCondition(c)}
              style={{
                padding: '7px 13px',
                borderRadius: 100,
                border: `1px solid ${selected
                  ? 'var(--acc1)'
                  : 'var(--card-border)'}`,
                background: selected ? 'var(--shine)' : 'transparent',
                color: selected ? 'var(--acc1)' : 'var(--text-muted)',
                fontFamily: 'var(--font-ui)',
                fontSize: 11,
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.3px',
              }}
            >
              {c}
            </button>
          )
        })}
      </div>

      <button
        style={{ ...primaryBtn, marginTop: 24 }}
        onClick={() => setStep(3)}
      >
        Continue
      </button>

      <SkipRow
        onSkip={() => setStep(3)}
        label="Private — only visible to you"
      />
    </div>
  )

  // ---- STEP 3: Choose character ----
  return (
    <div>
      <ProgressBar step={3} />

      <h1 style={{
        fontFamily: 'var(--font-head)', fontSize: 24,
        fontWeight: 700, color: 'var(--acc2)',
        letterSpacing: 1, marginBottom: 6,
      }}>
        Choose your world
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--text-muted)',
        marginBottom: 24, lineHeight: 1.6,
      }}>
        Which princess do you identify with? This sets your Blossom
        theme and Luna's personality. You can change it anytime.
      </p>

      {/* Character grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
      }}>
        {THEME_ORDER.map(id => {
          const t   = THEMES[id]
          const sel = chosenTheme === id
          return (
            <button
              key={id}
              onClick={() => setChosenTheme(id)}
              style={{
                background: 'var(--card)',
                border: `1px solid ${sel
                  ? 'var(--acc1)'
                  : 'var(--card-border)'}`,
                borderRadius: 12,
                padding: '16px 12px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                outline: 'none',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>
                {t.icon}
              </div>
              <div style={{
                fontFamily: 'var(--font-head)',
                fontSize: 11,
                color: sel ? 'var(--acc2)' : 'var(--text-muted)',
                letterSpacing: 1,
                marginBottom: 4,
              }}>
                {t.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontStyle: 'italic',
                fontSize: 11,
                color: 'var(--text-hint)',
              }}>
                {t.tagline.split('—')[0].trim()}
              </div>
            </button>
          )
        })}
      </div>

      <button
        style={{ ...primaryBtn, marginTop: 20 }}
        onClick={finish}
        disabled={loading}
      >
        {loading ? 'Saving…' : 'Enter Blossom ✦'}
      </button>

      <SkipRow
        onSkip={finish}
        label="Default theme is Frozen"
      />
    </div>
  )
}