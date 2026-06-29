const router = require('express').Router()
const authenticate = require('../middleware/authenticate')
const { getStatus } = require('../services/rateLimit.service')

router.get('/quota', authenticate, async (req, res) => {
  try {
    const status = await getStatus(req.user.userId)
    res.json(status)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
