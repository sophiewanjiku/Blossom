interface Props {
  email: string
  onContinue: () => void
}

export default function VerifyEmail({ email, onContinue }: Props) {
  return (
    <div>
      {/* Email sent banner */}
      <div style={{
        background: 'rgba(148,210,255,0.07)',
        border: '1px solid rgba(148,210,255,0.2)',
        borderRadius: 10, padding: '14px 16px',
        marginBottom: 24, display: 'flex', gap: 12,
      }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>📬</span>
        <p style={{
          fontSize: 12, color: 'var(--text-muted)',
          lineHeight: 1.6, fontFamily: 'var(--font-ui)',
        }}>
          We sent a verification link to{' '}
          <strong style={{ color: 'var(--acc1)', fontWeight: 500 }}>
            {email}
          </strong>
          . Check your inbox and click the link to verify your account.
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
        Your account is ready. Verify your email to unlock all features —
        or continue now and verify later.
      </p>

      <button
        onClick={onContinue}
        style={{
          width: '100%', padding: 13, borderRadius: 10,
          background: 'transparent', border: '1px solid var(--acc1)',
          color: 'var(--acc1)', fontFamily: 'var(--font-head)',
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        Continue to sign in
      </button>

      <p style={{
        textAlign: 'center', marginTop: 18,
        fontFamily: 'var(--font-ui)', fontSize: 12,
        color: 'var(--text-hint)',
      }}>
        Didn't receive it?{' '}
        <button style={{
          background: 'none', border: 'none',
          color: 'var(--text-muted)', cursor: 'pointer',
          fontFamily: 'var(--font-ui)', fontSize: 12,
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}>
          Resend verification email
        </button>
      </p>
    </div>
  )
}