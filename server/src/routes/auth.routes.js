const router = require('express').Router()
const { register, login, refresh, logout, verifyOtp, resendOtp, forgotPassword, resetPassword } = require('../controllers/auth.controller')

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router
