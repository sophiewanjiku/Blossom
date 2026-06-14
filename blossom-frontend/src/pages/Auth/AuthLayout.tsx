import { useEffect, useState } from 'react'
import { THEMES, THEME_ORDER } from '../../themes/themes'

// Slide data — one per fairytale world
const SLIDES = [
  {
    theme: 'frozen',
    bg: 'linear-gradient(135deg, #0A1628, #1a2d4a, #0D1F38)',
    accentColor: '#94D2FF',
    world: 'Frozen · Arendelle',
    title: 'Know your\npower, Elsa',
    verse: '"Your body holds the magic. Track every phase of your cycle and understand your rhythm."',
  },
  {
    theme: 'tiana',
    bg: 'linear-gradient(135deg, #0A1A08, #1a3a10, #0D2210)',
    accentColor: '#7DC95E',
    world: 'Tiana · New Orleans',
    title: 'Almost there,\ncher',
    verse: '"Hard work, knowledge, and your own health — the most powerful recipe of all."',
  },
  {
    theme: 'rapunzel',
    bg: 'linear-gradient(135deg, #1A0A2E, #3a1560, #221040)',
    accentColor: '#DCA8FF',
    world: 'Rapunzel · The Tower',
    title: 'See the world\nwithin you',
    verse: '"You\'ve been in the tower long enough. Your health story is yours to tell."',
  },
  {
    theme: 'cinderella',
    bg: 'linear-gradient(135deg, #12100A, #2a2410, #1A1608)',
    accentColor: '#FFD764',
    world: 'Cinderella · The Palace',
    title: 'The magic\nwas always you',
    verse: '"No fairy godmother needed. Understanding your cycle is the most powerful spell."',
  },
]

// children is the React prop that renders whatever you put between
// <AuthLayout>...</AuthLayout> tags
interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  const [current, setCurrent] = useState(0)

  // Auto-advance the carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length)
    }, 4000)

    // Cleanup: clear the interval when component unmounts
    return () => clearInterval(timer)
  }, [])

  const slide = SLIDES[current]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ---- LEFT: Carousel ---- */}
      <div style={{
        flex: '0 0 52%',
        position: 'relative',
        overflow: 'hidden',
        background: slide.bg,
        transition: 'background 1s ease',
      }}>
        {/* Brand badge */}
        <div style={{
          position: 'absolute', top: 32, left: 40, zIndex: 3,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            border: `1px solid ${slide.accentColor}44`,
            background: `${slide.accentColor}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}>
            {THEMES[slide.theme as keyof typeof THEMES].icon}
          </div>
          <span style={{
            fontFamily: 'var(--font-head)',
            fontSize: 18, fontWeight: 700, letterSpacing: 2,
            color: slide.accentColor,
          }}>
            Blossom
          </span>
        </div>

        {/* Big emoji watermark */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 160, opacity: 0.06, pointerEvents: 'none',
          transition: 'opacity 0.5s',
        }}>
          {THEMES[slide.theme as keyof typeof THEMES].icon}
        </div>

        {/* Slide text */}
        <div style={{
          position: 'absolute', bottom: 60, left: 44, right: 44, zIndex: 2,
        }}>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: 11,
            letterSpacing: 3, textTransform: 'uppercase',
            color: slide.accentColor, marginBottom: 12, opacity: 0.9,
          }}>
            {slide.world}
          </div>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 700,
            color: 'var(--text)', lineHeight: 1.1, marginBottom: 14,
            whiteSpace: 'pre-line',
          }}>
            {slide.title}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontStyle: 'italic',
            fontSize: 14, color: 'rgba(232,244,255,0.65)', lineHeight: 1.75,
          }}>
            {slide.verse}
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{
          position: 'absolute', bottom: 24, left: 44,
          display: 'flex', gap: 8, zIndex: 3,
        }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 36 : 24,
                height: 3, borderRadius: 2, border: 'none', cursor: 'pointer',
                background: i === current
                  ? slide.accentColor
                  : 'rgba(148,210,255,0.25)',
                transition: 'all 0.3s',
                padding: 0,
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ---- RIGHT: Form area ---- */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 40px',
        background: 'var(--bg1)',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {children}
        </div>
      </div>
    </div>
  )
}