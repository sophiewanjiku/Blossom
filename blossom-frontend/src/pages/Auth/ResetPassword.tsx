import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { authApi } from '../../lib/api'
import PasswordStrength from '../../components/ui/PasswordStrength'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate       = useNavigate()
  const token          = searchParams.get('token') ?? ''

  const [password, setPassword]   = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)
  const [error, setError]         = useState('')

  async function handleSubmit() {
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== password2) {
      setError('Passwords do not match.')
      return
    }
    if (!token) {
      setError('Invalid reset link. Please request a new one.')
      return
    }

    setLoading(true)
    try {
      await authApi.resetPassword({ token, password, password2 })
      setDone(true)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string | string[] } } }
      const detail = e.response?.data?.detail
      setError(
        Array.isArray(detail)
          ? detail[0]
          : detail ?? 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{
          fontFamily: 'var(--font-head)', fontSize: 22,
          color: 'var(--acc2)', marginBottom: 8,
        }}>
          Invalid link
        </div>
        <p style={{
          fontFamily: 'var(--font-body)', fontStyle: 'italic',
          fontSize: 13, color: 'var(--text-muted)',
          lineHeight: 1.7, marginBottom: 24,
        }}>
          This reset link is missing or invalid.
          Please request a new one.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 28px', borderRadius: 10,
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

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>✦</div>
        <div style={{
          fontFamily: 'var(--font-head)', fontSize: 22,
          color: 'var(--acc2)', marginBottom: 8, letterSpacing: 1,
        }}>
          Password updated
        </div>
        <p style={{
          fontFamily: 'var(--font-body)', fontStyle: 'italic',
          fontSize: 13, color: 'var(--text-muted)',
          lineHeight: 1.7, marginBottom: 24,
        }}>
          Your password has been changed successfully.
          You can now sign in with your new password.
        </p>
        <button
          onClick={() => navigate('/')}
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
          Sign in
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
        Set new password
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--text-muted)',
        marginBottom: 28, lineHeight: 1.6,
      }}>
        Choose a strong password for your Blossom account.
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-ui)', fontSize: 10,
          letterSpacing: '1.5px', textTransform: 'uppercase',
          color: 'var(--text-hint)', marginBottom: 6,
        }}>
          New password
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Min 8 characters"
          style={{
            width: '100%', background: 'var(--card)',
            border: '1px solid var(--card-border)',
            borderRadius: 10, padding: '11px 14px',
            fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'var(--text)', outline: 'none',
          }}
        />
        <PasswordStrength password={password} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-ui)', fontSize: 10,
          letterSpacing: '1.5px', textTransform: 'uppercase',
          color: 'var(--text-hint)', marginBottom: 6,
        }}>
          Confirm new password
        </label>
        <input
          type="password"
          value={password2}
          onChange={e => setPassword2(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Repeat your password"
          style={{
            width: '100%', background: 'var(--card)',
            border: '1px solid var(--card-border)',
            borderRadius: 10, padding: '11px 14px',
            fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'var(--text)', outline: 'none',
          }}
        />
      </div>

      {error && (
        <p style={{
          fontSize: 12, color: 'rgba(255,120,120,0.9)',
          fontFamily: 'var(--font-ui)', marginBottom: 14,
          padding: '10px 14px', borderRadius: 8,
          background: 'rgba(255,80,80,0.08)',
          border: '1px solid rgba(255,80,80,0.15)',
        }}>
          {error}
        </p>
      )}

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
        }}
      >
        {loading ? 'Updating…' : 'Update password'}
      </button>
    </div>
  )
}