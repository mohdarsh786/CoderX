import CodeBlock from '../ui/CodeBlock'

export default function MessageList({ messages, sending }) {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '1.4rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {messages.map((msg, i) => (
        <div key={msg._id || i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
          {msg.role === 'user' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
              {/* File pill — shown when message contains an attachment */}
              {msg.content.includes('[attached:') && (() => {
                const match = msg.content.match(/\[attached: (.+?)\]/)
                return match ? (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.2rem 0.6rem',
                    background: '#fef9e0', border: '0.5px solid #e8d880',
                    borderRadius: 6, fontSize: 11, color: '#7a5c00'
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9a7a00" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    {match[1]}
                  </div>
                ) : null
              })()}
              {/* Message bubble — strip the [attached: ...] suffix */}
              <div style={{
                maxWidth: '65%', padding: '0.55rem 1rem',
                background: '#f0e060', borderRadius: '14px 14px 3px 14px',
                fontSize: 13, color: '#1a1000', lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}>
                {msg.content.replace(/\s*\[attached:.*?\]/, '').trim()}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: '80%', width: '100%' }}>
              <div style={{ fontSize: 10, color: '#b8a060', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>CODERX</div>
              <div style={{
                background: '#fff', border: '0.5px solid #ede8c0',
                borderRadius: '3px 14px 14px 14px',
                padding: '0.65rem 0.9rem', fontSize: 13,
                color: '#1a1400', lineHeight: 1.55
              }}>
                <CodeBlock content={msg.content} />
              </div>
            </div>
          )}
        </div>
      ))}
      {sending && (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ maxWidth: '80%' }}>
            <div style={{ fontSize: 10, color: '#b8a060', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>CODERX</div>
            <div style={{
              background: '#fff', border: '0.5px solid #ede8c0',
              borderRadius: '3px 14px 14px 14px',
              padding: '0.65rem 0.9rem', display: 'flex', gap: 4, alignItems: 'center'
            }}>
              {[0, 150, 300].map(delay => (
                <div key={delay} style={{
                  width: 5, height: 5, borderRadius: '50%', background: '#d4b800',
                  animation: `bounce 0.9s ${delay}ms infinite`
                }} />
              ))}
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(-4px) }
        }
      `}</style>
    </div>
  )
}
