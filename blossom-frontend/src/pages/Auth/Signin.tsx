import { useState } from 'react'
import FormField from '../../components/ui/FormField'
import { authApi } from '../../lib/api'
import { useAuthStore } from '../../store/index'

interface Props {
  onSuccess: () => void
  onSignupClick: () => void
}

export default function Signin({ onSuccess, onSignupClick }: Props) {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]  = useState(false)
  const [errors, setErrors]    = useState<Record<string, string>>({})

  async function handleSubmit() {
    const e: Record<string, string> = {}
    if (!email)    e.email    = 'Email is required'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    if (Object.keys(e).length) return

    const res = await authApi.login({ email, password })
    useAuthStore.getState().setAuth(res.data.user, res.data.access)
    onSuccess()

    setLoading(true)
    try {
      // TODO: replace with real API call
      // const res = await authApi.login({ email, password })
      // useAuthStore.getState().setAuth(res.data.user, res.data.access)
      await new Promise(r => setTimeout(r, 1100))
      onSuccess()
    } catch {
      setErrors({ password: 'Incorrect email or password' })
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

      <FormField
        label="Email address"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        error={errors.email}
      />

      <FormField
        label="Password"
        type="password"
        value={password}
        onChange={v => { setPassword(v); if (errors.password) setErrors({}) }}
        placeholder="Your password"
        error={errors.password}
      />

      <div style={{ textAlign: 'right', marginBottom: 6 }}>
        <button style={{
          background: 'none', border: 'none',
          color: 'var(--text-muted)', cursor: 'pointer',
          fontFamily: 'var(--font-ui)', fontSize: 11,
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}>
          Forgot password?
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%', padding: 13, borderRadius: 10,
          background: 'transparent', border: '1px solid var(--acc1)',
          color: 'var(--acc1)', fontFamily: 'var(--font-head)',
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p style={{
        textAlign: 'center', marginTop: 20,
        fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-hint)',
      }}>
        New to Blossom?{' '}
        <button
          onClick={onSignupClick}
          style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12,
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}
        >
          Create an account
        </button>
      </p>
    </div>
  )
}