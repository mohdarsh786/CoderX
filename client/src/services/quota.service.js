import api from './api'

export const getQuotaStatus = async () => {
  const { data } = await api.get('/api/user/quota')
  return data
}
