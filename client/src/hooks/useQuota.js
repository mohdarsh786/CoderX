import { useState, useEffect, useCallback } from 'react'
import { getQuotaStatus } from '../services/quota.service'

export const useQuota = (isAuth) => {
  const [remaining, setRemaining] = useState(15)
  const [resetAt, setResetAt] = useState(null)
  const [countdown, setCountdown] = useState(null)

  const refresh = useCallback(async () => {
    if (!isAuth) return
    try {
      const data = await getQuotaStatus()
      setRemaining(data.remaining)
      setResetAt(data.resetAt ? new Date(data.resetAt) : null)
    } catch {}
  }, [isAuth])

  // Countdown timer
  useEffect(() => {
    if (!resetAt) { setCountdown(null); return }
    const tick = () => {
      const diff = resetAt - Date.now()
      if (diff <= 0) { setCountdown(null); setResetAt(null); refresh(); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(`${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [resetAt, refresh])

  useEffect(() => { refresh() }, [refresh])

  const decrement = () => setRemaining(p => Math.max(0, p - 1))

  return { remaining, countdown, resetAt, refresh, decrement }
}
