import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Sidebar({ chats = [], activeId, onNewChat, onSelectChat, onDeleteChat }) {
  const navigate = useNavigate()
  const { user, signout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)

  const initials = user?.fullName
    ? user.fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const handleSignout = async () => {
    await signout()
    navigate('/')
  }

  if (collapsed) return (
    <div style={{
      width: 44, background: '#faf8ec', borderRight: '0.5px solid #ede8c0',
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0', flexShrink: 0
    }}>
      <button onClick={() => setCollapsed(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#b8a060' }}>☰</button>
    </div>
  )

  const today = chats.filter(c => {
    const d = new Date(c.createdAt)
    return new Date() - d < 86400000
  })
  const older = chats.filter(c => {
    const d = new Date(c.createdAt)
    return new Date() - d >= 86400000
  })

  const ChatItem = ({ chat }) => (
    <div
      onMouseEnter={() => setHoveredId(chat.conversationId)}
      onMouseLeave={() => setHoveredId(null)}
      style={{ display: 'flex', alignItems: 'center', borderRadius: 6, marginBottom: 1,
        background: activeId === chat.conversationId ? '#f0e060' : hoveredId === chat.conversationId ? '#f5edb0' : 'transparent'
      }}
    >
      <button onClick={() => onSelectChat(chat.conversationId)} style={{
        flex: 1, textAlign: 'left', padding: '0.38rem 0.6rem',
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 12, color: '#5c4a00', whiteSpace: 'nowrap',
        overflow: 'hidden', textOverflow: 'ellipsis'
      }}>
        {chat.title || 'New chat'}
      </button>
      {hoveredId === chat.conversationId && (
        <button onClick={e => { e.stopPropagation(); onDeleteChat(chat.conversationId) }} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          paddingRight: '0.5rem', fontSize: 12, color: '#c0aa60'
        }}>🗑</button>
      )}
    </div>
  )

  return (
    <div style={{
      width: 220, background: '#faf8ec', borderRight: '0.5px solid #ede8c0',
      display: 'flex', flexDirection: 'column', flexShrink: 0
    }}>
      <div style={{ padding: '1rem 1rem 0.6rem', borderBottom: '0.5px solid #ede8c0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#1a1400' }}>
            Coder<span style={{ color: '#9a7a00' }}>X</span>
          </span>
          <button onClick={() => setCollapsed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#c0aa60' }}>✕</button>
        </div>
        <button onClick={onNewChat} style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          width: '100%', padding: '0.4rem 0.6rem', borderRadius: 6,
          border: '0.5px solid #e0d080', fontSize: 12, color: '#7a5c00',
          cursor: 'pointer', background: 'transparent'
        }}>
          <span>+</span> New chat
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0.5rem' }}>
        {today.length > 0 && (
          <>
            <div style={{ fontSize: 10, color: '#c0aa60', padding: '0.5rem 0.5rem 0.2rem', letterSpacing: '0.05em' }}>Today</div>
            {today.map(c => <ChatItem key={c.conversationId} chat={c} />)}
          </>
        )}
        {older.length > 0 && (
          <>
            <div style={{ fontSize: 10, color: '#c0aa60', padding: '0.5rem 0.5rem 0.2rem', letterSpacing: '0.05em' }}>Earlier</div>
            {older.map(c => <ChatItem key={c.conversationId} chat={c} />)}
          </>
        )}
        {chats.length === 0 && (
          <p style={{ fontSize: 11, color: '#c0aa60', padding: '0.5rem' }}>No chats yet</p>
        )}
      </div>

      <div style={{ padding: '0.7rem 1rem', borderTop: '0.5px solid #ede8c0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%', background: '#f0d840',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 500, color: '#2c1a00', flexShrink: 0
        }}>{initials}</div>
        <span style={{ fontSize: 12, color: '#5c4a00', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.fullName}</span>
        <button onClick={handleSignout} title="Sign out" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: '#c0aa60' }}>⎋</button>
      </div>
    </div>
  )
}
