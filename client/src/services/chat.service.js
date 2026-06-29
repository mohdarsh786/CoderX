import api from './api'

export const createChat = async () => {
  const { data } = await api.post('/api/chats')
  return data
}

export const getUserChats = async () => {
  const { data } = await api.get('/api/chats')
  return data
}

export const getChatMessages = async (conversationId) => {
  const { data } = await api.get(`/api/chats/${conversationId}`)
  return data
}

export const deleteChat = async (conversationId) => {
  await api.delete(`/api/chats/${conversationId}`)
}

export const sendMessage = async (message, conversationId, history = [], fileData = null) => {
  const { data } = await api.post('/api/ai/message', {
    message,
    conversationId,
    history,
    fileData,
  })
  return data
}

export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const sendGuestMessage = async (message, history = []) => {
  const { data } = await api.post('/api/guest/message', { message, history })
  return data
}
