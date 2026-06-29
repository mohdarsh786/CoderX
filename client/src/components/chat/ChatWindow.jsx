import { useRef, useEffect, useState } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import GuestBanner from './GuestBanner'
import QuotaBar from './QuotaBar'
import { sendGuestMessage } from '../../services/chat.service'

const GUEST_LIMIT = 3

export default function ChatWindow({
  isAuth, inputVisible, messages = [], sending, loading,
  quota, onSend, onLimitReached,
}) {
  const [guestCount, setGuestCount] = useState(0)
  const [guestMessages, setGuestMessages] = useState([])
  const [guestSending, setGuestSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, guestMessages, sending, guestSending])

  const handleSend = async (text) => {
    if (isAuth) { await onSend(text); return }

    const next = guestCount + 1
    setGuestCount(next)

    const userMsg = { role: 'user', content: text, _id: Date.now() }
    setGuestMessages(prev => [...prev, userMsg])
    setGuestSending(true)

    // Build history from existing guest messages
    const history = guestMessages.slice(-6).map(m => ({
      role: m.role,
      content: typeof m.content === 'object'
        ? (m.content.explanation || '') + (m.content.code ? '\n' + m.content.code : '')
        : m.content,
    }))

    try {
      const result = await sendGuestMessage(text, history)
      const assistantMsg = {
        role: 'assistant',
        content: result.response,
        _id: Date.now() + 1,
      }
      const updated = [...guestMessages, userMsg, assistantMsg]
      setGuestMessages(updated)

      // Store for migration on signup
      const storable = updated.map(m => ({
        role: m.role,
        content: typeof m.content === 'object'
          ? (m.content.explanation || '') + (m.content.code ? '\n```\n' + m.content.code + '\n```' : '')
          : m.content,
      }))
      sessionStorage.setItem('guestMessages', JSON.stringify(storable))
    } catch (err) {
      const signInRequired = err.response?.data?.signInRequired
      if (!signInRequired) {
        setGuestCount(prev => prev - 1)
      }
      const assistantMsg = {
        role: 'assistant',
        content: {
          explanation: signInRequired
            ? 'You have reached the guest limit. Sign in to continue.'
            : 'Something went wrong. Please try again.',
          code: null,
          confidence: 1,
        },
        _id: Date.now() + 1,
      }
      setGuestMessages(prev => [...prev, assistantMsg])
    } finally {
      setGuestSending(false)
    }

    if (next >= GUEST_LIMIT) onLimitReached()
  }

  const displayMessages = isAuth ? messages : guestMessages
  const rateLimited = isAuth && quota?.remaining === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {isAuth && quota && (
        <QuotaBar remaining={quota.remaining} countdown={quota.countdown} />
      )}
      {!isAuth && guestCount < GUEST_LIMIT && (
        <GuestBanner remaining={GUEST_LIMIT - guestCount} />
      )}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {displayMessages.length === 0 && !loading ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', textAlign: 'center', padding: '2rem'
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 400, color: '#1a1400', marginBottom: '0.5rem' }}>
              Coder<span style={{ color: '#9a7a00' }}>X</span>
            </div>
            <p style={{ fontSize: 13, color: '#b8a060' }}>What can I help you code today?</p>
          </div>
        ) : (
          <MessageList messages={displayMessages} sending={isAuth ? sending : guestSending} />
        )}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div style={{
              width: 18, height: 18, border: '2px solid #e0d080',
              borderTopColor: '#d4b800', borderRadius: '50%',
              animation: 'spin 0.7s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {inputVisible && (
        <MessageInput
          onSend={handleSend}
          disabled={rateLimited || (!isAuth && guestCount >= GUEST_LIMIT)}
          sending={isAuth ? sending : guestSending}
          isAuth={isAuth}
        />
      )}
    </div>
  )
}
