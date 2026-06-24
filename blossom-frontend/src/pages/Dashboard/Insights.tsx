import { motion } from 'framer-motion'
import { useThemeStore } from '../../store/index'
import { THEMES } from '../../themes/themes'

const CONDITIONS = [
  {
    emoji: '🌿', name: 'Endometriosis', tag: 'Affects 1 in 10',
    desc: 'Tissue similar to the uterine lining grows outside the uterus, causing chronic pain and inflammation.',
    symptoms: ['Severe cramps', 'Heavy periods', 'Pelvic pain', 'Fatigue', 'Bloating'],
    detail: 'Can take 7–10 years to diagnose. Speak to a gynaecologist if period pain disrupts your daily life.',
  },
  {
    emoji: '🍃', name: 'PCOS', tag: 'Affects 1 in 8',
    desc: 'A hormonal disorder causing irregular periods, excess androgen, and ovarian cysts.',
    symptoms: ['Irregular periods', 'Weight gain', 'Acne', 'Hair thinning'],
    detail: 'Manageable with lifestyle changes and hormonal therapy. Many women with PCOS conceive with support.',
  },
  {
    emoji: '🌱', name: 'Uterine fibroids', tag: 'Up to 80% of women',
    desc: 'Non-cancerous growths in the uterus. Very common — many women have no symptoms.',
    symptoms: ['Heavy bleeding', 'Pelvic pressure', 'Back pain', 'Anaemia'],
    detail: 'Most are benign. Heavy bleeding soaking a pad per hour warrants urgent attention.',
  },
  {
    emoji: '🌻', name: 'Adenomyosis', tag: 'Often misdiagnosed',
    desc: 'The uterine lining grows into the muscular wall, causing severe periods.',
    symptoms: ['Severe cramps', 'Heavy bleeding', 'Enlarged uterus'],
    detail: 'Hormonal therapy can manage symptoms effectively. You deserve answers.',
  },
  {
    emoji: '💚', name: 'Cervical cancer', tag: 'Largely preventable',
    desc: 'Primarily caused by HPV. Regular smear tests and vaccination are your best protection.',
    symptoms: ['Abnormal bleeding', 'Post-sex bleeding', 'Unusual discharge'],
    detail: 'Regular cervical screening every 3–5 years is essential. The HPV vaccine dramatically reduces risk.',
  },
]

export default function Insights() {
  const { themeId } = useThemeStore()
  const theme       = THEMES[themeId]

  return (
    <div style={{ padding: '44px 24px 24px' }}>
      <div style={{
        fontFamily: 'var(--font-head)', fontSize: 28,
        color: 'var(--acc2)', fontStyle: 'italic', marginBottom: 4,
      }}>
        Health insights
      </div>
      <div style={{
        fontFamily: 'var(--font-body)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6,
      }}>
        Knowledge is the most powerful thing you own.
      </div>

      {/* Awareness banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--card-border)',
          borderRadius: 16, padding: '16px 20px',
          marginBottom: 20, display: 'flex',
          alignItems: 'center', gap: 14,
        }}
      >
        <span style={{ fontSize: 26, flexShrink: 0 }}>{theme.icon}</span>
        <div>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: 15,
            color: 'var(--acc2)', marginBottom: 3,
          }}>
            Know your body, know your rights
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontStyle: 'italic',
            fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6,
          }}>
            Many conditions go undiagnosed for years. You deserve to know the signs.
          </div>
        </div>
      </motion.div>

      {/* Condition cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CONDITIONS.map((c, i) => (
          <ConditionCard key={c.name} condition={c} delay={i * 0.07} />
        ))}
      </div>
    </div>
  )
}

function ConditionCard({ condition: c, delay }: { condition: typeof CONDITIONS[0], delay: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={() => setOpen(o => !o)}
      style={{
        background: 'var(--card)',
        border: `1px solid ${open ? 'var(--acc1)' : 'var(--card-border)'}`,
        borderRadius: 16, overflow: 'hidden',
        cursor: 'pointer', transition: 'border-color 0.2s',
      }}
    >
      <div style={{ padding: '16px 18px 12px', display: 'flex', gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          border: '1px solid var(--card-border)',
          background: 'var(--shine)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 20, flexShrink: 0,
        }}>
          {c.emoji}
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: 15,
            color: 'var(--acc2)', marginBottom: 3,
          }}>
            {c.name}
          </div>
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 9,
            padding: '2px 9px', borderRadius: 100,
            border: '1px solid var(--card-border)',
            color: 'var(--text-muted)', display: 'inline-block',
            letterSpacing: 0.8,
          }}>
            {c.tag}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 18px 16px' }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 13,
          color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 10,
        }}>
          {c.desc}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {c.symptoms.map(s => (
            <span key={s} style={{
              fontSize: 10, padding: '3px 9px', borderRadius: 100,
              border: '1px solid var(--card-border)',
              color: 'var(--text-hint)', fontFamily: 'var(--font-ui)',
            }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--card-border)' }}
          >
            <p style={{
              padding: '14px 18px',
              fontFamily: 'var(--font-body)', fontStyle: 'italic',
              fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7,
            }}>
              {c.detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// useState needs to be imported here since ConditionCard uses it
import { useState } from 'react'