const requests = new Map()

const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS = 3

const guestRateLimit = (req, res, next) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
  const now = Date.now()
  const entry = requests.get(ip)

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    requests.set(ip, { windowStart: now, count: 1 })
    return next()
  }

  if (entry.count >= MAX_REQUESTS) {
    return res.status(429).json({
      message: 'Guest limit reached. Sign in to continue.',
      signInRequired: true,
    })
  }

  entry.count++
  
  res.on('finish', () => {
    if (res.statusCode >= 400 && res.statusCode !== 429) {
      entry.count = Math.max(0, entry.count - 1)
    }
  })

  next()
}

// Clean up stale IPs every hour
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of requests.entries()) {
    if (now - entry.windowStart > WINDOW_MS) requests.delete(ip)
  }
}, WINDOW_MS)

module.exports = { guestRateLimit }
