import { motion } from 'framer-motion'

export default function Fertility() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Fertile window banner */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--card-border)',
        borderRadius: 16, padding: '22px 24px', marginBottom: 20,
      }}>
        <div style={{
          fontFamily: 'var(--font-head)', fontSize: 22,
          color: 'var(--acc2)', marginBottom: 4,
        }}>
          Your fertile window is open
        </div>
        <div style={{
          fontFamily: 'var(--font-body)', fontStyle: 'italic',
          fontSize: 13, color: 'var(--text-muted)', marginBottom: 18,
        }}>
          Highest conception probability — now through the next 2 days
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Window opens', val: 'May 11' },
            { label: 'Peak ovulation', val: 'May 14 ★' },
            { label: 'Window closes', val: 'May 16' },
            { label: 'Next period', val: 'May 28' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'var(--shine)',
              border: '1px solid var(--card-border)',
              borderRadius: 10, padding: '12px 16px', minWidth: 110,
            }}>
              <div style={{
                fontFamily: 'var(--font-ui)', fontSize: 9,
                color: 'var(--text-hint)', letterSpacing: 1.5,
                textTransform: 'uppercase', marginBottom: 4,
              }}>
                {item.label}
              </div>
              <div style={{
                fontFamily: 'var(--font-head)', fontSize: 16,
                color: 'var(--acc1)',
              }}>
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
      }}>
        {[
          { icon: '🌡️', title: 'Basal temperature', text: 'Track every morning before rising. A rise of 0.2–0.5°C confirms ovulation.' },
          { icon: '💧', title: 'Cervical mucus', text: 'Egg-white consistency at peak fertility. Clear and stretchy — your window is open.' },
          { icon: '🥗', title: 'Nutrition', text: 'Folate, zinc and iron support egg quality. Leafy greens, legumes and seeds.' },
          { icon: '🧘‍♀️', title: 'Stress and cycles', text: 'High cortisol can delay ovulation. Breathwork and light movement help.' },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--card-border)',
              borderRadius: 12, padding: 16,
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 10 }}>{card.icon}</div>
            <div style={{
              fontFamily: 'var(--font-head)', fontSize: 12,
              color: 'var(--acc2)', marginBottom: 6, letterSpacing: 0.5,
            }}>
              {card.title}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontStyle: 'italic',
              fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7,
            }}>
              {card.text}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}