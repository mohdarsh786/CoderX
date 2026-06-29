import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useChat } from '../hooks/useChat'
import { useQuota } from '../hooks/useQuota'
import Sidebar from '../components/layout/Sidebar'
import ChatWindow from '../components/chat/ChatWindow'
import SignInModal from '../components/chat/SignInModal'

import { useNavigate } from 'react-router-dom'

export default function Chat() {
  const { isAuth, signout } = useAuth()
  const chat = useChat()
  const quota = useQuota(isAuth)
  const navigate = useNavigate()
  
  const [showModal, setShowModal] = useState(false)
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false)
  const [inputVisible, setInputVisible] = useState(true)

  useEffect(() => {
    if (isAuth) {
      chat.loadChats()
      
      // Trap the back button
      window.history.pushState({ isChatTrapped: true }, '', window.location.href)
      
      const handlePopState = () => {
        setShowSignoutConfirm(true)
      }
      
      window.addEventListener('popstate', handlePopState)
      return () => window.removeEventListener('popstate', handlePopState)
    }
  }, [isAuth])

  const handleDismiss = () => {
    setShowModal(false)
    setInputVisible(false)
  }

  const handleCancelSignout = () => {
    setShowSignoutConfirm(false)
    // Re-trap the back button
    window.history.pushState({ isChatTrapped: true }, '', window.location.href)
  }

  const handleConfirmSignout = async () => {
    setShowSignoutConfirm(false)
    await signout()
    navigate('/login', { replace: true })
  }

  const handleSend = async (text, fileData = null) => {
    if (!isAuth) return

    // Auto-create chat if none active
    let current = chat.activeChat
    if (!current) {
      current = await chat.startNewChat()
      if (!current) return
    }

    const result = await chat.send(text, fileData)
    if (!result) return

    if (result.rateLimited) {
      quota.refresh()
      return
    }

    if (result.success) {
      quota.decrement()
      if (result.piiRedacted) {
        console.info('PII was redacted from your message before sending.')
      }
    }
  }

  const handleNewChat = async () => {
    await chat.startNewChat()
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#fdfcf5' }}>
      {isAuth && (
        <Sidebar
          chats={chat.chats}
          activeId={chat.activeChat?.conversationId}
          onNewChat={handleNewChat}
          onSelectChat={chat.switchChat}
          onDeleteChat={chat.removeChat}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow
          isAuth={isAuth}
          inputVisible={inputVisible}
          messages={chat.messages}
          sending={chat.sending}
          loading={chat.loading}
          quota={quota}
          onSend={handleSend}
          onLimitReached={() => setShowModal(true)}
        />
      </div>
      {showModal && <SignInModal onDismiss={handleDismiss} />}
      
      {showSignoutConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#ffffff', padding: '2rem', borderRadius: 12,
            width: 340, textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#1a1400', marginBottom: '0.5rem', fontWeight: 500 }}>
              Sign out of CoderX?
            </h3>
            <p style={{ color: '#7a6830', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to sign out and leave the chat?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleCancelSignout} style={{
                flex: 1, padding: '0.6rem', border: '1px solid #ede8c0',
                background: 'transparent', borderRadius: 8, cursor: 'pointer',
                color: '#5c4a00', fontWeight: 500
              }}>
                Cancel
              </button>
              <button onClick={handleConfirmSignout} style={{
                flex: 1, padding: '0.6rem', border: 'none',
                background: '#f0d840', borderRadius: 8, cursor: 'pointer',
                color: '#1a1400', fontWeight: 500
              }}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
