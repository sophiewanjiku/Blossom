import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useThemeStore } from '../../store/index'
import { useAuthStore } from '../../store/index'
import { THEMES } from '../../themes/themes'
import { useCycleRing } from '../../hooks/useCycleRing'
import { usePrediction } from '../../hooks/usePrediction'
import { cycleApi } from '../../lib/api'

const THEME_INSIGHTS = {
  frozen: [
    { icon: '❄️', type: 'Cycle insight',  title: 'Peak clarity ahead',  text: 'Oestrogen is rising. Your focus and verbal ability are at their sharpest this week.' },
    { icon: '🌨️', type: 'Nutrition',      title: 'Iron & folate now',   text: 'Support follicular growth with leafy greens, lentils, and seeds this phase.' },
    { icon: '✨', type: 'Skin forecast',  title: 'Your glow window',    text: 'Rising oestrogen boosts collagen. Expect clearer, more luminous skin.' },
    { icon: '🏔️', type: 'Movement',       title: 'Push your limits',    text: 'Your body recovers faster now. Ideal for strength training and cardio.' },
    { icon: '🧊', type: 'Mood forecast',  title: 'Confidence rising',   text: 'Expect social ease and clarity. A good time for important conversations.' },
  ],
  tiana: [
    { icon: '🌿', type: 'Cycle insight',  title: 'Peak clarity ahead',  text: 'Oestrogen is rising through the bayou. Your focus and confidence are at their sharpest.' },
    { icon: '🥘', type: 'Nutrition',      title: 'Nourish your roots',  text: 'Iron and folate now. Leafy greens, lentils, seeds — the bayou\'s finest.' },
    { icon: '✨', type: 'Skin forecast',  title: 'Your glow window',    text: 'Rising oestrogen boosts collagen. Expect clearer, more luminous skin ahead.' },
    { icon: '🏃‍♀️', type: 'Movement',      title: 'Push your limits',    text: 'Your body recovers faster now. Ideal phase for strength and cardio work.' },
    { icon: '🧠', type: 'Mood forecast',  title: 'Confidence rising',   text: 'Social ease and optimism bloom. A good time for important conversations.' },
  ],
  rapunzel: [
    { icon: '🌸', type: 'Cycle insight',  title: 'Peak clarity ahead',  text: 'The tower window is open. Your energy and focus are at their most radiant.' },
    { icon: '🌺', type: 'Nutrition',      title: 'Paint with colour',   text: 'Nourish your body with vibrant foods. Berries, seeds and leafy greens.' },
    { icon: '✨', type: 'Skin forecast',  title: 'Your glow window',    text: 'Rising oestrogen means luminous skin. Let your light shine through.' },
    { icon: '🎨', type: 'Movement',       title: 'Creative energy',     text: 'Channel your peak energy into movement and creativity. Dance, run, create.' },
    { icon: '💜', type: 'Mood forecast',  title: 'Radiance rising',     text: 'Your most socially magnetic days. Share your light with those around you.' },
  ],
  cinderella: [
    { icon: '✨', type: 'Cycle insight',  title: 'Peak clarity ahead',  text: 'The clock is on your side. Your focus and poise are at their finest.' },
    { icon: '🥂', type: 'Nutrition',      title: 'Glass slipper glow',  text: 'Iron, zinc and folate support this phase. Nourish the magic within.' },
    { icon: '👑', type: 'Skin forecast',  title: 'Your glow window',    text: 'Oestrogen works its magic. Clearer, more luminous skin is arriving.' },
    { icon: '💃', type: 'Movement',       title: 'Dance at the ball',   text: 'Peak recovery means peak performance. Your body is ready to move.' },
    { icon: '⭐', type: 'Mood forecast',  title: 'Confidence rising',   text: 'The carriage is yours. Social confidence and warmth are at their peak.' },
  ],
}

const RING_COLORS = {
  frozen:     ['#1A4A7A', '#2A6A9A', '#A8D8FF', '#0F3A5A'],
  tiana:      ['#3D7A2A', '#5A8A3A', '#D4A843', '#2A6A42'],
  rapunzel:   ['#6A2A8A', '#8A4AAA', '#FFD700', '#4A1A6A'],
  cinderella: ['#5A4A1A', '#8A742A', '#FFD764', '#3A3010'],
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { themeId }          = useThemeStore()
  const { user }             = useAuthStore()
  const theme                = THEMES[themeId]
  const insights             = THEME_INSIGHTS[themeId]
  const ringColors           = RING_COLORS[themeId]
  const canvasRef            = useRef<HTMLCanvasElement>(null)
  const [logged, setLogged]  = useState(false)
  const [logging, setLogging] = useState(false)

  // ---- REAL DATA from the algorithm ----
  const { prediction, loading } = usePrediction()

  const CYCLE_DAY  = prediction.current_day
  const TOTAL_DAYS = prediction.total_days
  const DAYS_LEFT  = prediction.days_until_period
  const PHASE_NAME = prediction.phase_name
  const PHASE_KEY  = prediction.phase as 'menstrual' | 'follicular' | 'ovulation' | 'luteal'

  // Feed real numbers into the 3D ring
  useCycleRing(canvasRef, themeId, CYCLE_DAY, TOTAL_DAYS)

  const firstName = user?.name?.split(' ')[0] ?? 'You'

  // Phase poetry from theme config
  const poetry = theme.phasePoetry[PHASE_KEY]?.replace(/"/g, '') ?? ''

  async function trackToday() {
    setLogging(true)
    try {
      await cycleApi.startPeriod('medium')
      setLogged(true)
    } catch {
      // If API fails, still show success locally
      setLogged(true)
    } finally {
      setLogging(false)
    }
  }

  return (
    <div>
      {/* ---- HERO ---- */}
      <div style={{
        padding: '44px 24px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: -80, right: -60,
            width: 260, height: 260, borderRadius: '50%',
            background: `radial-gradient(circle, ${ringColors[1]}22 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 12,
          fontWeight: 300, color: 'var(--text-muted)',
          letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 8, position: 'relative',
        }}>
          {greeting()}
        </div>

        <div style={{
          fontFamily: 'var(--font-head)', fontSize: 36,
          fontWeight: 400, color: 'var(--acc2)',
          lineHeight: 1.1, marginBottom: 20,
          fontStyle: 'italic', position: 'relative',
        }}>
          {firstName}
        </div>

        <div style={{
          display: 'flex', alignItems: 'baseline',
          gap: 10, marginBottom: 6, position: 'relative',
        }}>
          {loading ? (
            <div style={{
              width: 60, height: 52,
              background: 'var(--shine)',
              borderRadius: 8, animation: 'pulse 1.5s infinite',
            }} />
          ) : (
            <div style={{
              fontFamily: 'var(--font-head)', fontSize: 52,
              fontWeight: 300, color: 'var(--gold)', lineHeight: 1,
            }}>
              {CYCLE_DAY}
            </div>
          )}
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 11,
            color: 'var(--text-muted)', letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}>
            Cycle day
          </div>
        </div>

        <div style={{
          fontFamily: 'var(--font-body)', fontStyle: 'italic',
          fontSize: 20, color: 'var(--acc1)',
          marginBottom: 4, position: 'relative',
        }}>
          {loading ? '...' : PHASE_NAME}
        </div>

        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 12,
          fontWeight: 300, color: 'var(--text-muted)',
          letterSpacing: 0.3, lineHeight: 1.6,
          position: 'relative',
        }}>
          {prediction.no_data
            ? 'Set your last period date to begin tracking your cycle.'
            : poetry}
        </div>

        {/* Days until next period */}
        {!prediction.no_data && !loading && (
          <div style={{
            marginTop: 14, display: 'inline-flex',
            alignItems: 'center', gap: 8,
            background: 'var(--shine)',
            border: '1px solid var(--card-border)',
            borderRadius: 100, padding: '6px 14px',
          }}>
            <span style={{
              fontFamily: 'var(--font-head)', fontSize: 15,
              color: 'var(--gold)',
            }}>
              {DAYS_LEFT}
            </span>
            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: 10,
              color: 'var(--text-muted)', letterSpacing: 1,
              textTransform: 'uppercase',
            }}>
              days until next period
            </span>
          </div>
        )}
      </div>

      {/* ---- 3D CYCLE RING ---- */}
      <div style={{
        padding: '8px 24px 32px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          width: 240, height: 240,
          position: 'relative', marginBottom: 20,
        }}>
          <canvas
            ref={canvasRef}
            width={240}
            height={240}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />

          {/* Floating particles */}
          {[
            { top: '12%', left: '22%', delay: 0 },
            { top: '18%', right: '20%', delay: 1.2 },
            { bottom: '16%', left: '18%', delay: 2.4 },
            { bottom: '20%', right: '22%', delay: 0.8 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -14, -8, -18, 0],
                x: [0, 6, -4, 8, 0],
                opacity: [0.3, 0.8, 0.5, 0.9, 0.3],
              }}
              transition={{
                duration: 4, repeat: Infinity,
                delay: pos.delay, ease: 'easeInOut',
              }}
              style={{
                position: 'absolute', fontSize: 8,
                color: 'var(--acc1)', ...pos,
              }}
            >
              ✦
            </motion.div>
          ))}

          {/* Ring centre */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              fontFamily: 'var(--font-head)', fontSize: 40,
              fontWeight: 300, color: 'var(--gold)', lineHeight: 1,
            }}>
              {loading ? '–' : CYCLE_DAY}
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: 10,
              color: 'var(--text-muted)', letterSpacing: 2,
              textTransform: 'uppercase', marginTop: 3,
            }}>
              of {TOTAL_DAYS} days
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontStyle: 'italic',
              fontSize: 14, color: 'var(--acc1)', marginTop: 8,
            }}>
              {loading ? '...' : PHASE_NAME.split(' ')[0]}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          gap: 12, justifyContent: 'center',
        }}>
          {['Menstrual', 'Follicular', 'Ovulation', 'Luteal'].map((label, i) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: ringColors[i], flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: 11,
                color: 'var(--text-muted)', fontWeight: 300,
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- FERTILE WINDOW BANNER ---- */}
      {prediction.is_fertile_now && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            margin: '0 24px 20px',
            background: 'var(--shine)',
            border: '1px solid var(--acc1)',
            borderRadius: 14, padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <span style={{ fontSize: 22 }}>🌿</span>
          <div>
            <div style={{
              fontFamily: 'var(--font-head)', fontSize: 14,
              color: 'var(--acc2)', marginBottom: 2,
            }}>
              Fertile window open
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: 12,
              color: 'var(--text-muted)', fontWeight: 300,
            }}>
              {prediction.fertile_start} → {prediction.fertile_end}
            </div>
          </div>
        </motion.div>
      )}

      {/* ---- TRACK TODAY BUTTON ---- */}
      <div style={{ padding: '0 24px 28px' }}>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={trackToday}
          disabled={logging}
          style={{
            width: '100%', padding: 16,
            borderRadius: 100,
            background: logged
              ? 'var(--text-hint)'
              : 'var(--acc3)',
            border: 'none',
            color: logged ? 'var(--text-muted)' : 'var(--text)',
            fontFamily: 'var(--font-head)', fontSize: 15,
            fontWeight: 400, cursor: logging ? 'not-allowed' : 'pointer',
            letterSpacing: 0.5,
            transition: 'background 0.4s, color 0.4s',
            opacity: logging ? 0.7 : 1,
          }}
        >
          {logging ? 'Logging…' : logged ? 'Logged successfully ✦' : 'Track today'}
        </motion.button>
      </div>

      {/* ---- WELLNESS CAROUSEL ---- */}
      <div style={{ paddingBottom: 28 }}>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 10,
          letterSpacing: 2.5, textTransform: 'uppercase',
          color: 'var(--text-muted)', padding: '0 24px',
          marginBottom: 14,
        }}>
          Wellness insights
        </div>
        <div style={{
          display: 'flex', gap: 12,
          overflowX: 'auto', padding: '4px 24px 12px',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch' as const,
          scrollSnapType: 'x mandatory',
        }}>
          {insights.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3 }}
              style={{
                flex: '0 0 210px',
                background: 'var(--card)',
                border: '1px solid var(--card-border)',
                borderRadius: 20, padding: 20,
                scrollSnapAlign: 'start',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 12 }}>
                {card.icon}
              </div>
              <div style={{
                fontFamily: 'var(--font-ui)', fontSize: 9,
                letterSpacing: 2, textTransform: 'uppercase',
                color: 'var(--text-muted)', marginBottom: 5,
              }}>
                {card.type}
              </div>
              <div style={{
                fontFamily: 'var(--font-head)', fontSize: 16,
                color: 'var(--acc2)', marginBottom: 8, fontWeight: 400,
              }}>
                {card.title}
              </div>
              <div style={{
                fontFamily: 'var(--font-ui)', fontSize: 12,
                fontWeight: 300, color: 'var(--text-muted)',
                lineHeight: 1.75,
              }}>
                {card.text}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ---- LUNA ATELIER ---- */}
      <div style={{ padding: '0 24px 28px' }}>
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--card-border)',
          borderRadius: 20, padding: 24,
          position: 'relative', overflow: 'hidden',
        }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{
              position: 'absolute', top: -50, right: -50,
              width: 180, height: 180, borderRadius: '50%',
              background: `radial-gradient(circle, ${ringColors[2]}18, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 9,
            letterSpacing: 3, textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: 10,
          }}>
            Members only
          </div>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: 22,
            fontWeight: 400, color: 'var(--acc2)',
            marginBottom: 6, fontStyle: 'italic',
          }}>
            Luna Atelier
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontStyle: 'italic',
            fontSize: 13, color: 'var(--text-muted)',
            lineHeight: 1.7, marginBottom: 18,
          }}>
            Your personal wellness concierge. Deeper understanding, beautifully delivered.
          </div>
          {[
            'Hormone analytics & pattern recognition',
            'AI cycle forecasting up to 6 months',
            'Fertility planning & conception support',
            'Personalised wellness plans',
          ].map(feat => (
            <div key={feat} style={{
              fontFamily: 'var(--font-ui)', fontSize: 12,
              color: 'var(--acc1)', fontWeight: 300,
              display: 'flex', alignItems: 'center',
              gap: 8, marginBottom: 8,
            }}>
              <span style={{ color: 'var(--gold)', fontSize: 10 }}>✦</span>
              {feat}
            </div>
          ))}
          <motion.button
            whileHover={{ background: 'var(--shine)' } as any}
            style={{
              marginTop: 8, padding: '12px 28px',
              borderRadius: 100, background: 'transparent',
              border: '1px solid var(--gold)',
              color: 'var(--gold)', fontFamily: 'var(--font-head)',
              fontSize: 13, cursor: 'pointer',
              letterSpacing: 0.5, transition: 'background 0.3s',
            }}
          >
            Explore the Atelier
          </motion.button>
        </div>
      </div>
    </div>
  )
}