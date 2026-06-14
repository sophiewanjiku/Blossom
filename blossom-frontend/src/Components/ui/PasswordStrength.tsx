// Scores the password and shows 4 coloured bars
function getScore(pw: string): number {
  let score = 0
  if (pw.length >= 8)          score++
  if (/[A-Z]/.test(pw))        score++
  if (/[0-9]/.test(pw))        score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const COLORS = ['', '#ff6b6b', '#ffd93d', '#6bcb77', '#94D2FF']
const LABELS = ['', 'Too weak', 'Fair', 'Good', 'Strong']

export default function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const score = getScore(password)

  return (
    <div style={{ marginTop: 8 }}>
      {/* 4 bars */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= score
                ? COLORS[score]
                : 'rgba(148,210,255,0.1)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
      {/* Label */}
      <p style={{
        fontSize: 11, color: COLORS[score],
        fontFamily: 'var(--font-ui)',
        transition: 'color 0.3s',
      }}>
        {LABELS[score]}
      </p>
    </div>
  )
}