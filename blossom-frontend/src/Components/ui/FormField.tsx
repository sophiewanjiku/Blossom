interface FormFieldProps {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  error?: string
  hint?: string
}

export default function FormField({
  label, type = 'text', value, onChange,
  placeholder, error, hint,
}: FormFieldProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-ui)',
        fontSize: 10, letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: 'var(--text-hint)',
        marginBottom: 6,
      }}>
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: 'var(--card)',
          border: `1px solid ${error ? 'rgba(255,100,100,0.5)' : 'var(--card-border)'}`,
          borderRadius: 10,
          padding: '11px 14px',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--text)',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'var(--acc1)'
          e.target.style.boxShadow = '0 0 0 3px var(--shine)'
        }}
        onBlur={e => {
          e.target.style.borderColor = error
            ? 'rgba(255,100,100,0.5)'
            : 'var(--card-border)'
          e.target.style.boxShadow = 'none'
        }}
      />

      {hint && !error && (
        <p style={{
          fontSize: 11, color: 'var(--text-hint)',
          marginTop: 4, fontFamily: 'var(--font-ui)',
        }}>
          {hint}
        </p>
      )}

      {error && (
        <p style={{
          fontSize: 11, color: 'rgba(255,120,120,0.9)',
          marginTop: 4, fontFamily: 'var(--font-ui)',
        }}>
          {error}
        </p>
      )}
    </div>
  )
}