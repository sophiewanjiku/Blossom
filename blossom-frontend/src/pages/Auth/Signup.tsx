import { useState } from 'react'
import FormField from '../../components/ui/FormField'
import PasswordStrength from '../../components/ui/PasswordStrength'
import { authApi } from '../../lib/api'
import { useAuthStore } from '../../store/index'

interface Props {
  onSuccess: (email: string) => void
  onSigninClick: () => void
}

export default function Signup({ onSuccess, onSigninClick }: Props) {
  // One state variable per field — this is called "controlled inputs"
  // React owns the value, not the DOM
  const [firstName, setFirstName]   = useState('')
  const [lastName, setLastName]     = useState('')
  const [username, setUsername]     = useState('')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [password2, setPassword2]   = useState('')
  const [loading, setLoading]       = useState(false)

  // errors object — key is field name, value is error message
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}

    if (!firstName.trim())
      e.firstName = 'First name is required'

    if (!username || username.length < 3)
      e.username = 'Username must be at least 3 characters'

    if (!/^[a-zA-Z0-9_]+$/.test(username))
      e.username = 'Username can only contain letters, numbers and underscores'

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Enter a valid email address'

    if (password.length < 8)
      e.password = 'Password must be at least 8 characters'

    if (password !== password2)
      e.password2 = 'Passwords do not match'

    setErrors(e)
    // Returns true if no errors
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return

    setLoading(true)
    try {
     
      const res = await authApi.register({
      email,
      name: `${firstName} ${lastName}`.trim(),
      password,
      password2,
    })
    useAuthStore.getState().setAuth(res.data.user, res.data.access)
    onSuccess(email)
    } catch (err: unknown) {
      // Handle API errors — e.g. email already taken
      const apiError = err as { response?: { data?: { email?: string[] } } }
      if (apiError.response?.data?.email) {
        setErrors({ email: 'An account with this email already exists' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{
        fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700,
        color: 'var(--acc2)', letterSpacing: 1, marginBottom: 6,
      }}>
        Begin your story
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6,
      }}>
        Create your Blossom account and choose your fairytale world.
      </p>

      {/* Name row — side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormField
          label="First name"
          value={firstName}
          onChange={setFirstName}
          placeholder="Elsa"
          error={errors.firstName}
        />
        <FormField
          label="Last name"
          value={lastName}
          onChange={setLastName}
          placeholder="Andersen"
        />
      </div>

      <FormField
        label="Username"
        value={username}
        onChange={setUsername}
        placeholder="elsa_arendelle"
        error={errors.username}
      />

      <FormField
        label="Email address"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        hint="We'll send a verification link to this address."
        error={errors.email}
      />

      <FormField
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Min 8 characters"
        error={errors.password}
      />
      <PasswordStrength password={password} />

      <FormField
        label="Confirm password"
        type="password"
        value={password2}
        onChange={setPassword2}
        placeholder="Repeat your password"
        error={errors.password2}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%', padding: '13px', borderRadius: 10, marginTop: 6,
          background: 'transparent', border: '1px solid var(--acc1)',
          color: 'var(--acc1)', fontFamily: 'var(--font-head)',
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1, transition: 'all 0.25s',
        }}
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p style={{
        textAlign: 'center', marginTop: 20,
        fontFamily: 'var(--font-ui)', fontSize: 12,
        color: 'var(--text-hint)',
      }}>
        Already have an account?{' '}
        <button
          onClick={onSigninClick}
          style={{
            background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontSize: 12,
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}
        >
          Sign in
        </button>
      </p>
    </div>
  )
}