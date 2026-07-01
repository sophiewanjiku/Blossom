import { useState } from 'react'
import { authApi } from '../../lib/api'

interface Props {
  onBack: () => void
}

export default function ForgotPassword({ onBack }: Props) {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit() {
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    setError('')
    setLoading(true)

    try {
      await authApi.forgotPassword(email.trim().toLowerCase())
      setSent(true)
    } catch {
      // Even on error we show success — prevents email enumeration
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>📬</div>
          <h1 style={{
            fontFamily: 'var(--font-head)', fontSize: 24,
            color: 'var(--acc2)', marginBottom: 8, letterSpacing: 1,
          }}>
            Check your inbox
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontStyle: 'italic',
            fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7,
          }}>
            If an account exists for{' '}
            <strong style={{ color: 'var(--acc1)' }}>{email}</strong>,
            we've sent a password reset link. It expires in 1 hour.
          </p>
        </div>

        <button
          onClick={onBack}
          style={{
            width: '100%', padding: 13, borderRadius: 10,
            background: 'transparent',
            border: '1px solid var(--acc1)',
            color: 'var(--acc1)',
            fontFamily: 'var(--font-head)', fontSize: 11,
            letterSpacing: 2, textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Back to sign in
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{
        fontFamily: 'var(--font-head)', fontSize: 24,
        color: 'var(--acc2)', marginBottom: 6, letterSpacing: 1,
      }}>
        Reset your password
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--text-muted)',
        marginBottom: 28, lineHeight: 1.6,
      }}>
        Enter your email and we'll send you a link to set a new password.
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-ui)', fontSize: 10,
          letterSpacing: '1.5px', textTransform: 'uppercase',
          color: 'var(--text-hint)', marginBottom: 6,
        }}>
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="you@example.com"
          style={{
            width: '100%',
            background: 'var(--card)',
            border: `1px solid ${error ? 'rgba(255,100,100,0.5)' : 'var(--card-border)'}`,
            borderRadius: 10, padding: '11px 14px',
            fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'var(--text)', outline: 'none',
          }}
        />
        {error && (
          <p style={{
            fontSize: 11, color: 'rgba(255,120,120,0.9)',
            marginTop: 4, fontFamily: 'var(--font-ui)',
          }}>
            {error}
          </p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%', padding: 13, borderRadius: 10,
          background: 'transparent',
          border: '1px solid var(--acc1)',
          color: 'var(--acc1)',
          fontFamily: 'var(--font-head)', fontSize: 11,
          letterSpacing: 2, textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          marginBottom: 16,
        }}
      >
        {loading ? 'Sending…' : 'Send reset link'}
      </button>

      <p style={{
        textAlign: 'center',
        fontFamily: 'var(--font-ui)', fontSize: 12,
        color: 'var(--text-hint)',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontSize: 12,
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}
        >
          ← Back to sign in
        </button>
      </p>
    </div>
  )
}