import { useState, useCallback } from 'react'
import {
  createChat, getUserChats, getChatMessages,
  deleteChat, sendMessage,
} from '../services/chat.service'

export const useChat = () => {
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const loadChats = useCallback(async () => {
    try {
      const data = await getUserChats()
      setChats(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load chats')
    }
  }, [])

  const startNewChat = useCallback(async () => {
    try {
      const chat = await createChat()
      setChats(prev => [chat, ...prev])
      setActiveChat(chat)
      setMessages([])
      return chat
    } catch (err) {
      setError('Failed to create chat')
    }
  }, [])

  const switchChat = useCallback(async (conversationId) => {
    setLoading(true)
    try {
      const data = await getChatMessages(conversationId)
      setActiveChat(data.chat)
      // Parse stored assistant messages back from JSON string
      const parsed = data.messages.map(m => {
        if (m.role === 'assistant') {
          try { return { ...m, content: JSON.parse(m.content) }
          } catch { return m }
        }
        return m
      })
      setMessages(parsed)
    } catch (err) {
      setError('Failed to load chat')
    } finally {
      setLoading(false)
    }
  }, [])

  const send = useCallback(async (text, fileData = null) => {
    if (!activeChat) return

    const userMsg = {
      _id: Date.now(),
      role: 'user',
      content: fileData ? `${text} [attached: ${fileData.filename}]` : text,
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setSending(true)

    try {
      const history = messages.slice(-10).map(m => ({
        role: m.role,
        content: typeof m.content === 'object'
          ? (m.content.explanation || '') + (m.content.code ? '\n```\n' + m.content.code + '\n```' : '')
          : m.content,
      }))

      const result = await sendMessage(text, activeChat.conversationId, history, fileData)

      const assistantMsg = {
        _id: Date.now() + 1,
        role: 'assistant',
        content: result.response,
        createdAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])

      setChats(prev => prev.map(c =>
        c.conversationId === activeChat.conversationId
          ? { ...c, title: result.response?.title || c.title }
          : c
      ))

      if (messages.length === 0) {
        setTimeout(() => loadChats(), 3000)
      }

      return { success: true, piiRedacted: result.piiRedacted }
    } catch (err) {
      const status = err.response?.status
      if (status === 429) return { success: false, rateLimited: true, resetAt: err.response.data.resetAt }
      if (status === 400 && err.response?.data?.reason === 'prompt_injection') {
        setMessages(prev => [...prev, {
          _id: Date.now() + 2,
          role: 'assistant',
          content: { explanation: '⚠ Your message was flagged by the security filter. Please rephrase.', code: null, confidence: 1 },
          createdAt: new Date().toISOString(),
        }])
        return { success: false, flagged: true }
      }
      setError('Failed to send message')
      return { success: false }
    } finally {
      setSending(false)
    }
  }, [activeChat, messages])

  const removeChat = useCallback(async (conversationId) => {
    try {
      await deleteChat(conversationId)
      setChats(prev => prev.filter(c => c.conversationId !== conversationId))
      if (activeChat?.conversationId === conversationId) {
        setActiveChat(null)
        setMessages([])
      }
    } catch {
      setError('Failed to delete chat')
    }
  }, [activeChat])

  return {
    chats, activeChat, messages, loading, sending, error,
    loadChats, startNewChat, switchChat, send, removeChat,
  }
}
