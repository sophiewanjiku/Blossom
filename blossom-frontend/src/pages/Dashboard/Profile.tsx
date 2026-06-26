import { useAuthStore, useThemeStore } from '../../store/index'
import { THEMES, THEME_ORDER } from '../../themes/themes'
import { motion } from 'framer-motion'

export default function Profile() {
  const { user, clearAuth }   = useAuthStore()
  const { themeId, setTheme } = useThemeStore()

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() ?? 'S'

  return (
    <div style={{ padding: '44px 24px 24px' }}>
      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          border: '1px solid var(--acc1)',
          background: 'var(--shine)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-head)', fontSize: 22,
          color: 'var(--acc1)',
        }}>
          {initials}
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: 22,
            color: 'var(--acc2)', fontStyle: 'italic',
          }}>
            {user?.name ?? 'Sarah'}
          </div>
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 12,
            color: 'var(--text-muted)', marginTop: 3,
          }}>
            {user?.email ?? 'sarah@blossom.app'}
          </div>
        </div>
      </div>

      {/* Theme switcher */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 10,
          letterSpacing: 2, textTransform: 'uppercase',
          color: 'var(--text-hint)', marginBottom: 14,
        }}>
          Your world
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {THEME_ORDER.map(id => {
            const t   = THEMES[id]
            const sel = themeId === id
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTheme(id)}
                style={{
                  background: 'var(--card)',
                  border: `1px solid ${sel ? 'var(--acc1)' : 'var(--card-border)'}`,
                  borderRadius: 14, padding: '14px 12px',
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.2s', outline: 'none',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>{t.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-head)', fontSize: 12,
                  color: sel ? 'var(--acc2)' : 'var(--text-muted)',
                  letterSpacing: 0.5,
                }}>
                  {t.name}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Health conditions */}
      {user && (
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 10,
            letterSpacing: 2, textTransform: 'uppercase',
            color: 'var(--text-hint)', marginBottom: 14,
          }}>
            Health profile
          </div>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            borderRadius: 14, padding: 16,
          }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontStyle: 'italic',
              fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
            }}>
              Complete your profile to unlock personalised insights.
            </div>
          </div>
        </div>
      )}

      {/* Sign out */}
      <button
        onClick={clearAuth}
        style={{
          width: '100%', padding: 14, borderRadius: 100,
          background: 'transparent',
          border: '1px solid var(--card-border)',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-ui)', fontSize: 12,
          cursor: 'pointer', letterSpacing: 1,
          textTransform: 'uppercase', transition: 'all 0.2s',
        }}
      >
        Sign out
      </button>
    </div>
  )
}