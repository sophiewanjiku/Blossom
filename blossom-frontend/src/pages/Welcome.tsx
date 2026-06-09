import { useThemeStore } from '../store/index'
import { THEMES, THEME_ORDER } from '../themes/themes'

export default function Welcome() {
  const { themeId, setTheme } = useThemeStore()
  const theme = THEMES[themeId]

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>

      {/* Icon */}
      <div style={{ fontSize: 52, marginBottom: 12 }}>
        {theme.icon}
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--font-head)',
        fontSize: 44,
        fontWeight: 700,
        color: 'var(--acc1)',
        letterSpacing: 3,
        textShadow: '0 0 40px var(--acc1)',
        marginBottom: 8,
      }}>
        Blossom
      </h1>

      {/* Tagline changes with theme */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontStyle: 'italic',
        fontSize: 15,
        color: 'var(--text-muted)',
        marginBottom: 48,
        letterSpacing: 1,
      }}>
        {theme.tagline}
      </p>

      {/* Theme picker */}
      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 10,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: 'var(--text-hint)',
        marginBottom: 14,
      }}>
        Choose your world
      </p>

      <div style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 48,
      }}>
        {THEME_ORDER.map((id) => {
          const t = THEMES[id]
          const isActive = id === themeId
          return (
            <button
              key={id}
              onClick={() => setTheme(id)}
              style={{
                padding: '8px 18px',
                borderRadius: 100,
                border: `1px solid ${isActive ? 'var(--acc1)' : 'var(--card-border)'}`,
                background: isActive ? 'var(--shine)' : 'var(--card)',
                color: isActive ? 'var(--acc1)' : 'var(--text-muted)',
                fontFamily: 'var(--font-head)',
                fontSize: 11,
                letterSpacing: 1,
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>{t.icon}</span>
              {t.name}
            </button>
          )
        })}
      </div>

      {/* Phase poetry — changes with theme */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontStyle: 'italic',
        fontSize: 13,
        color: 'var(--text-hint)',
        maxWidth: 300,
        textAlign: 'center',
        lineHeight: 1.8,
      }}>
        {theme.phasePoetry.ovulation}
      </p>
    </div>
  )
}