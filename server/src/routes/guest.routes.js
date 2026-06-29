const router = require('express').Router()
const { guestRateLimit } = require('../middleware/guestRateLimit')
const { processMessage } = require('../services/ai.service')

router.post('/message', guestRateLimit, async (req, res) => {
  try {
    const { message, history = [] } = req.body

    if (!message || typeof message !== 'string' || message.trim().length === 0)
      return res.status(400).json({ message: 'Message is required' })

    if (message.length > 2000)
      return res.status(400).json({ message: 'Message too long (max 2000 chars)' })

    const result = await processMessage(message.trim(), history)

    if (result.flagged) {
      return res.status(400).json({
        message: 'Message flagged by security filter',
        reason: result.flagReason,
      })
    }

    if (result.error) return res.status(502).json({ message: result.error })

    res.json({
      response: result.response,
      piiRedacted: result.piiFound?.length > 0,
    })
  } catch (err) {
    console.error('Guest AI error:', err.message)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
