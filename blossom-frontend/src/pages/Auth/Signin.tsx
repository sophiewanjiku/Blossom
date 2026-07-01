import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../lib/api'
import { useAuthStore } from '../../store/index'
import ForgotPassword from './ForgotPassword'

interface Props {
  onSuccess: () => void
  onSignupClick: () => void
}

export default function Signin({ onSuccess, onSignupClick }: Props) {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState<Record<string, string>>({})
  const [showForgot, setShowForgot] = useState(false)

  // Show forgot password screen
  if (showForgot) {
    return <ForgotPassword onBack={() => setShowForgot(false)} />
  }

  async function handleSubmit() {
    const e: Record<string, string> = {}
    if (!email)    e.email    = 'Email is required'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    try {
      const res = await authApi.login({ email, password })
      useAuthStore.getState().setAuth(res.data.user, res.data.access)

      // Check if onboarding is complete
      if (res.data.user.onboarding_complete) {
        navigate('/app')
      } else {
        onSuccess() // go through onboarding
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } }
      setErrors({
        password: e.response?.data?.detail ?? 'Incorrect email or password'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{
        fontFamily: 'var(--font-head)', fontSize: 24,
        color: 'var(--acc2)', marginBottom: 6, letterSpacing: 1,
      }}>
        Welcome back
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--text-muted)',
        marginBottom: 28, lineHeight: 1.6,
      }}>
        Sign in to continue your fairytale health journey.
      </p>

      {/* Email */}
      <div style={{ marginBottom: 16 }}>
        <label style={{
          display: 'block', fontFamily: 'var(--font-ui)',
          fontSize: 10, letterSpacing: '1.5px',
          textTransform: 'uppercase', color: 'var(--text-hint)',
          marginBottom: 6,
        }}>
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{
            width: '100%', background: 'var(--card)',
            border: `1px solid ${errors.email ? 'rgba(255,100,100,0.5)' : 'var(--card-border)'}`,
            borderRadius: 10, padding: '11px 14px',
            fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'var(--text)', outline: 'none',
          }}
        />
        {errors.email && (
          <p style={{
            fontSize: 11, color: 'rgba(255,120,120,0.9)',
            marginTop: 4, fontFamily: 'var(--font-ui)',
          }}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div style={{ marginBottom: 8 }}>
        <label style={{
          display: 'block', fontFamily: 'var(--font-ui)',
          fontSize: 10, letterSpacing: '1.5px',
          textTransform: 'uppercase', color: 'var(--text-hint)',
          marginBottom: 6,
        }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value)
            if (errors.password) setErrors({})
          }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Your password"
          style={{
            width: '100%', background: 'var(--card)',
            border: `1px solid ${errors.password ? 'rgba(255,100,100,0.5)' : 'var(--card-border)'}`,
            borderRadius: 10, padding: '11px 14px',
            fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'var(--text)', outline: 'none',
          }}
        />
        {errors.password && (
          <p style={{
            fontSize: 11, color: 'rgba(255,120,120,0.9)',
            marginTop: 4, fontFamily: 'var(--font-ui)',
          }}>
            {errors.password}
          </p>
        )}
      </div>

      {/* Forgot password */}
      <div style={{ textAlign: 'right', marginBottom: 20 }}>
        <button
          onClick={() => setShowForgot(true)}
          style={{
            background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontSize: 11,
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}
        >
          Forgot password?
        </button>
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
        }}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p style={{
        textAlign: 'center', marginTop: 20,
        fontFamily: 'var(--font-ui)', fontSize: 12,
        color: 'var(--text-hint)',
      }}>
        New to Blossom?{' '}
        <button
          onClick={onSignupClick}
          style={{
            background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontSize: 12,
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}
        >
          Create an account
        </button>
      </p>
    </div>
  )
}