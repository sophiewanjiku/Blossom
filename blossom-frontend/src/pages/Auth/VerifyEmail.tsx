import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { authApi } from '../../lib/api'

interface Props {
  email: string
  onContinue: () => void
}

// This component handles TWO scenarios:
// 1. Right after signup — shows "check your inbox" message
// 2. User clicks the link in email — token is in the URL,
//    we verify it automatically

export default function VerifyEmail({ email, onContinue }: Props) {
  const [searchParams] = useSearchParams()
  const navigate       = useNavigate()
  const token          = searchParams.get('token')

  const [status, setStatus]   = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [resending, setResending] = useState(false)
  const [resent, setResent]       = useState(false)

  // If there's a token in the URL, verify it automatically
  useEffect(() => {
    if (!token) return

    setStatus('verifying')
    authApi.verifyEmail(token)
      .then(() => {
        setStatus('success')
        // After 2 seconds redirect to signin
        setTimeout(() => navigate('/'), 2000)
      })
      .catch(err => {
        setStatus('error')
        setMessage(
          err.response?.data?.detail
          ?? 'This link has expired or is invalid.'
        )
      })
  }, [token])

  async function resend() {
    setResending(true)
    try {
      await authApi.resendVerification()
      setResent(true)
    } catch {
      // silently fail
    } finally {
      setResending(false)
    }
  }

  // ---- TOKEN IN URL — showing verification result ----
  if (token) {
    return (
      <div>
        {status === 'verifying' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
            <div style={{
              fontFamily: 'var(--font-head)', fontSize: 20,
              color: 'var(--acc2)', marginBottom: 8,
            }}>
              Verifying your email…
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontStyle: 'italic',
              fontSize: 13, color: 'var(--text-muted)',
            }}>
              Just a moment.
            </div>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>✦</div>
            <div style={{
              fontFamily: 'var(--font-head)', fontSize: 22,
              color: 'var(--acc2)', marginBottom: 8, letterSpacing: 1,
            }}>
              Email verified
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontStyle: 'italic',
              fontSize: 13, color: 'var(--text-muted)',
              lineHeight: 1.7, marginBottom: 24,
            }}>
              Your account is confirmed. Redirecting you to sign in…
            </div>
          </div>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
            <div style={{
              fontFamily: 'var(--font-head)', fontSize: 22,
              color: 'var(--acc2)', marginBottom: 8,
            }}>
              Link expired
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontStyle: 'italic',
              fontSize: 13, color: 'var(--text-muted)',
              lineHeight: 1.7, marginBottom: 24,
            }}>
              {message}
            </div>
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
              Back to sign in
            </button>
          </div>
        )}
      </div>
    )
  }

  // ---- NO TOKEN — showing "check your inbox" ----
  return (
    <div>
      {/* Email sent banner */}
      <div style={{
        background: 'var(--shine)',
        border: '1px solid var(--card-border)',
        borderRadius: 12, padding: '14px 16px',
        marginBottom: 24,
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>📬</span>
        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: 12,
          color: 'var(--text-muted)', lineHeight: 1.6,
        }}>
          We sent a verification link to{' '}
          <strong style={{ color: 'var(--acc1)', fontWeight: 500 }}>
            {email}
          </strong>.
          Click it to verify your account.
        </p>
      </div>

      <h1 style={{
        fontFamily: 'var(--font-head)', fontSize: 24,
        color: 'var(--acc2)', marginBottom: 8, letterSpacing: 1,
      }}>
        Check your inbox
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--text-muted)',
        marginBottom: 28, lineHeight: 1.6,
      }}>
        Your account is ready — verify your email to unlock
        all features, or continue now and verify later.
      </p>

      <button
        onClick={onContinue}
        style={{
          width: '100%', padding: 13, borderRadius: 10,
          background: 'transparent',
          border: '1px solid var(--acc1)',
          color: 'var(--acc1)',
          fontFamily: 'var(--font-head)', fontSize: 11,
          letterSpacing: 2, textTransform: 'uppercase',
          cursor: 'pointer', marginBottom: 16,
        }}
      >
        Continue to sign in
      </button>

      <p style={{
        textAlign: 'center',
        fontFamily: 'var(--font-ui)', fontSize: 12,
        color: 'var(--text-hint)',
      }}>
        {resent ? (
          <span style={{ color: 'var(--acc1)' }}>
            ✦ Verification email resent
          </span>
        ) : (
          <>
            Didn't receive it?{' '}
            <button
              onClick={resend}
              disabled={resending}
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                fontFamily: 'var(--font-ui)', fontSize: 12,
                textDecoration: 'underline', textUnderlineOffset: 3,
                opacity: resending ? 0.5 : 1,
              }}
            >
              {resending ? 'Sending…' : 'Resend verification email'}
            </button>
          </>
        )}
      </p>
    </div>
  )
}