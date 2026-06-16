import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CONDITIONS = [
  {
    emoji: '🌾', name: 'Endometriosis', badge: 'Affects 1 in 10',
    desc: 'Tissue similar to the uterine lining grows outside the uterus, causing chronic pain and inflammation.',
    symptoms: ['Severe cramps', 'Heavy periods', 'Pelvic pain', 'Fatigue', 'Bloating'],
    detail: 'Endometriosis can take 7–10 years to diagnose. Laparoscopy is the only definitive test. Speak to a gynaecologist if period pain disrupts your daily life.',
  },
  {
    emoji: '🍂', name: 'PCOS', badge: 'Affects 1 in 8',
    desc: 'A hormonal disorder causing irregular periods, excess androgen, and ovarian cysts.',
    symptoms: ['Irregular periods', 'Weight gain', 'Acne', 'Hair thinning', 'Mood changes'],
    detail: 'PCOS is manageable with lifestyle changes and hormonal therapy. Many women with PCOS conceive with support.',
  },
  {
    emoji: '🌰', name: 'Uterine fibroids', badge: 'Up to 80% of women',
    desc: 'Non-cancerous growths in the uterus. Very common — many women have no symptoms at all.',
    symptoms: ['Heavy bleeding', 'Pelvic pressure', 'Back pain', 'Frequent urination', 'Anaemia'],
    detail: 'Most fibroids are benign and need no treatment. Heavy bleeding soaking a pad per hour needs urgent attention.',
  },
  {
    emoji: '🌻', name: 'Adenomyosis', badge: 'Awareness',
    desc: 'The uterine lining grows into the muscular wall, causing severe periods and an enlarged uterus.',
    symptoms: ['Severe cramps', 'Heavy bleeding', 'Enlarged uterus', 'Pelvic pressure'],
    detail: 'Most common in women in their 30s–40s. Hormonal therapy can manage symptoms effectively.',
  },
  {
    emoji: '💛', name: 'Cervical cancer', badge: 'Preventable',
    desc: 'Primarily caused by HPV and largely preventable through regular smear tests and vaccination.',
    symptoms: ['Abnormal bleeding', 'Post-sex bleeding', 'Unusual discharge', 'Pelvic pain'],
    detail: 'Regular cervical screening every 3–5 years is essential. The HPV vaccine dramatically reduces risk.',
  },
  {
    emoji: '🌿', name: 'Premature ovarian insufficiency', badge: 'Affects 1 in 100',
    desc: 'When ovaries stop functioning normally before age 40, leading to low oestrogen and irregular periods.',
    symptoms: ['Missed periods', 'Hot flashes', 'Night sweats', 'Vaginal dryness', 'Mood changes'],
    detail: 'Not the same as early menopause. HRT is typically recommended to protect bone and heart health.',
  },
]

export default function Health() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div>
      {/* Awareness banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--card2, var(--card))',
          border: '1px solid var(--card-border)',
          borderRadius: 12, padding: '18px 22px',
          marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 28, flexShrink: 0 }}>✦</span>
        <div>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: 16,
            color: 'var(--acc2)', marginBottom: 4,
          }}>
            Know your body, know your rights
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontStyle: 'italic',
            fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6,
          }}>
            Many conditions go undiagnosed for years. Tap any card to learn the signs to watch for.
          </div>
        </div>
      </motion.div>

      {/* Condition cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 14,
      }}>
        {CONDITIONS.map((c, i) => {
          const isOpen = expanded === c.name
          return (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setExpanded(isOpen ? null : c.name)}
              style={{
                background: 'var(--card)',
                border: `1px solid ${isOpen ? 'var(--acc1)' : 'var(--card-border)'}`,
                borderRadius: 14, overflow: 'hidden',
                cursor: 'pointer', transition: 'border-color 0.2s',
              }}
            >
              {/* Card top */}
              <div style={{ padding: '18px 18px 12px', display: 'flex', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  border: '1px solid var(--card-border)',
                  background: 'var(--shine)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 22, flexShrink: 0,
                }}>
                  {c.emoji}
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-head)', fontSize: 15,
                    color: 'var(--acc2)', marginBottom: 4,
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
                    {c.badge}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ padding: '0 18px 14px' }}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 12,
                  color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 10,
                }}>
                  {c.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {c.symptoms.map(s => (
                    <span key={s} style={{
                      fontSize: 10, padding: '3px 9px',
                      borderRadius: 100, border: '1px solid var(--card-border)',
                      color: 'var(--text-hint)',
                      fontFamily: 'var(--font-ui)',
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      overflow: 'hidden',
                      borderTop: '1px solid var(--card-border)',
                    }}
                  >
                    <div style={{ padding: '14px 18px' }}>
                      <p style={{
                        fontFamily: 'var(--font-body)', fontStyle: 'italic',
                        fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7,
                      }}>
                        {c.detail}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}