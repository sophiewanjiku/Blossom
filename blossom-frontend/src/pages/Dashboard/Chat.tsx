import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useThemeStore } from '../../store/index'
import { THEMES } from '../../themes/themes'

interface Message {
  role: 'assistant' | 'user'
  content: string
  time: string
}

const QUICK_CHIPS = [
  'What is endometriosis?',
  'Signs of PCOS?',
  'How to boost fertility naturally?',
  'Why are my periods irregular?',
  'Early pregnancy signs',
  'Heavy periods — is it normal?',
]

const SYSTEM_PROMPT = `You are Luna, a warm and knowledgeable women's health companion inside Blossom, an enchanted period tracking app. Help women understand their cycles, fertility, pregnancy, and reproductive health conditions including endometriosis, PCOS, fibroids, adenomyosis, and cervical cancer.

Be warm, supportive, and concise. Keep responses to 2–3 short paragraphs. Use occasional relevant emoji. Never diagnose — always empower with knowledge and recommend consulting a doctor for personal medical concerns.`

export default function Chat() {
  const { themeId }  = useThemeStore()
  const theme        = THEMES[themeId]
  const [messages, setMessages]   = useState<Message[]>([
    {
      role: 'assistant',
      content: theme.luna.greeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function now() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: Message = { role: 'user', content, time: now() }
    const history = [...messages, userMsg]

    setMessages(history)
    setInput('')
    setLoading(true)

    try {
      // Call Claude API directly from frontend for now
      // In Backend Part 6 we move this to POST /api/ai/chat/
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text ?? 'I had trouble with that — please try again.'

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        time: now(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection issue — please try again. ✦',
        time: now(),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--card-border)',
        borderRadius: 16, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        height: 560,
      }}
    >
      {/* Chat header */}
      <div style={{
        padding: '15px 20px', display: 'flex',
        alignItems: 'center', gap: 13,
        borderBottom: '1px solid var(--card-border)',
        background: 'var(--bg3, var(--bg2))',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '1px solid var(--acc1)',
          background: 'var(--shine)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 18,
        }}>
          {theme.icon}
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: 14,
            color: 'var(--acc2)', letterSpacing: 1,
          }}>
            {theme.luna.name}
          </div>
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 10,
            color: 'var(--text-hint)', marginTop: 2,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#4CAF50', display: 'inline-block',
            }} />
            {theme.luna.status}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: 18,
        display: 'flex', flexDirection: 'column', gap: 13,
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%', display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <div style={{
              padding: '10px 14px',
              borderRadius: msg.role === 'user'
                ? '16px 16px 3px 16px'
                : '16px 16px 16px 3px',
              background: msg.role === 'user'
                ? 'var(--acc3)'
                : 'var(--bg2)',
              border: msg.role === 'user'
                ? 'none'
                : '1px solid var(--card-border)',
              color: msg.role === 'user' ? '#fff' : 'var(--text)',
              fontFamily: 'var(--font-body)',
              fontSize: 13, lineHeight: 1.65,
            }}>
              {msg.content}
            </div>
            <div style={{
              fontSize: 10, color: 'var(--text-hint)',
              fontFamily: 'var(--font-ui)',
              textAlign: msg.role === 'user' ? 'right' : 'left',
              padding: '0 4px',
            }}>
              {msg.time}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ alignSelf: 'flex-start' }}>
            <div style={{
              padding: '10px 16px',
              background: 'var(--bg2)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px 16px 16px 3px',
              display: 'flex', gap: 5, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: 'var(--text-hint)',
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      <div style={{
        padding: '10px 16px', display: 'flex',
        gap: 7, overflowX: 'auto',
        borderTop: '1px solid var(--card-border)',
        background: 'var(--bg2)',
        scrollbarWidth: 'none',
      }}>
        {QUICK_CHIPS.map(chip => (
          <button
            key={chip}
            onClick={() => sendMessage(chip)}
            style={{
              padding: '6px 12px', borderRadius: 100,
              border: '1px solid var(--card-border)',
              background: 'transparent',
              color: 'var(--acc1)',
              fontFamily: 'var(--font-head)', fontSize: 11,
              whiteSpace: 'nowrap', cursor: 'pointer',
              transition: 'all 0.2s', letterSpacing: 0.3,
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 14px', display: 'flex',
        gap: 9, alignItems: 'center',
        borderTop: '1px solid var(--card-border)',
        background: 'var(--bg1)',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder={`Ask ${theme.luna.name.split(' ')[0]} anything…`}
          style={{
            flex: 1, background: 'var(--card)',
            border: '1px solid var(--card-border)',
            borderRadius: 100, padding: '9px 16px',
            fontFamily: 'var(--font-body)', fontSize: 13,
            color: 'var(--text)', outline: 'none',
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading}
          style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'transparent',
            border: '1px solid var(--acc1)',
            color: 'var(--acc1)', cursor: 'pointer',
            fontSize: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            opacity: loading ? 0.5 : 1,
          }}
        >
          ➤
        </button>
      </div>

      {/* Disclaimer */}
      <div style={{
        fontFamily: 'var(--font-body)', fontStyle: 'italic',
        fontSize: 10, color: 'var(--text-hint)',
        textAlign: 'center', padding: '8px 16px',
        borderTop: '1px solid var(--card-border)',
        background: 'var(--bg2)',
      }}>
        Luna provides general health information only. Always consult a qualified healthcare provider.
      </div>
    </motion.div>
  )
}