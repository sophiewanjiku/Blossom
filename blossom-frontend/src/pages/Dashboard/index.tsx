import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useThemeStore } from '../../store/index'
import { THEMES } from '../../themes/themes'
import Home from './Home'
import CalendarTab from './CalendarTab'
import Insights from './Insights'
import Journal from './Journal'
import Profile from './Profile'

type Tab = 'home' | 'calendar' | 'insights' | 'journal' | 'profile'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home',      label: 'Home',     icon: '⌂' },
  { id: 'calendar',  label: 'Calendar', icon: '◫' },
  { id: 'insights',  label: 'Insights', icon: '✦' },
  { id: 'journal',   label: 'Journal',  icon: '✎' },
  { id: 'profile',   label: 'Profile',  icon: '◯' },
]

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('home')
  const { themeId }   = useThemeStore()
  const theme         = THEMES[themeId]

  return (
    <div style={{
      background: 'var(--bg1)',
      minHeight: '100vh',
      maxWidth: 420,
      margin: '0 auto',
      position: 'relative',
      paddingBottom: 88,
      overflowX: 'hidden',
    }}>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
        >
          {tab === 'home'     && <Home />}
          {tab === 'calendar' && <CalendarTab />}
          {tab === 'insights' && <Insights />}
          {tab === 'journal'  && <Journal />}
          {tab === 'profile'  && <Profile />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 420,
        background: 'rgba(0,0,0,0.85)',
        borderTop: '1px solid var(--card-border)',
        display: 'flex',
        padding: '8px 0 18px',
        zIndex: 100,
        backdropFilter: 'blur(20px)',
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              transition: 'all 0.2s',
            }}
          >
            <span style={{
              fontSize: 19,
              filter: tab === t.id
                ? 'drop-shadow(0 0 5px var(--acc1))'
                : 'none',
              transition: 'filter 0.2s',
            }}>
              {t.icon}
            </span>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 9,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: tab === t.id ? 'var(--acc1)' : 'var(--text-hint)',
              transition: 'color 0.2s',
            }}>
              {t.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}