import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '../../store/index'
import { THEMES } from '../../themes/themes'
import Tracker from './Tracker'
import Fertility from './Fertility'
import Health from './Health'
import Chat from './Chat'

type Tab = 'tracker' | 'fertility' | 'health' | 'chat'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'tracker',   label: 'Track',     icon: '✦' },
  { id: 'fertility', label: 'Fertility',  icon: '✦' },
  { id: 'health',    label: 'Health',     icon: '✦' },
  { id: 'chat',      label: 'Luna',       icon: '✦' },
]

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('tracker')
  const { themeId }   = useThemeStore()
  const theme         = THEMES[themeId]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg1)' }}>

      {/* ---- HEADER ---- */}
      <header style={{
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--card-border)',
        padding: '0 20px',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 0',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '1px solid var(--card-border)',
              background: 'var(--shine)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20,
            }}>
              {theme.icon}
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-head)', fontSize: 20,
                fontWeight: 700, color: 'var(--acc1)',
                letterSpacing: 2,
              }}>
                Blossom
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontStyle: 'italic',
                fontSize: 11, color: 'var(--text-muted)', marginTop: 1,
              }}>
                {theme.tagline}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { val: 'Day 14', label: 'Cycle' },
              { val: '28',     label: 'Avg' },
              { val: '14',     label: 'Left' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-head)', fontSize: 18,
                  color: 'var(--gold)', lineHeight: 1,
                }}>
                  {s.val}
                </div>
                <div style={{
                  fontFamily: 'var(--font-ui)', fontSize: 9,
                  color: 'var(--text-hint)', letterSpacing: 1.5,
                  textTransform: 'uppercase', marginTop: 3,
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ---- NAV ---- */}
      <nav style={{
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex',
        position: 'sticky', top: 73, zIndex: 40,
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'flex', width: '100%',
        }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: '14px 8px',
                border: 'none', background: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-head)',
                fontSize: 10, letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: tab === t.id ? 'var(--acc1)' : 'var(--text-hint)',
                borderBottom: `2px solid ${tab === t.id ? 'var(--acc1)' : 'transparent'}`,
                transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 5,
              }}
            >
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ---- CONTENT — animates between tabs ---- */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '22px 18px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {tab === 'tracker'   && <Tracker />}
            {tab === 'fertility' && <Fertility />}
            {tab === 'health'    && <Health />}
            {tab === 'chat'      && <Chat />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}