const { findUserByEmail, createUser, verifyPassword } = require('../services/auth.service');
const { migrateGuestMessages } = require('../services/guestMigration.service');
const { issueTokens, rotateTokens, revokeAllTokens, clearRefreshCookie, REFRESH_COOKIE } = require('../services/token.service');
const { hashAndStoreOtp, verifyStoredOtp } = require('../services/otp.service');
const { sendOtpEmail, sendResetEmail } = require('../services/email.service');
const bcrypt = require('bcryptjs');
const supabase = require('../config/db.supabase');

const register = async (req, res) => {
  try {
    const { email, password, fullName, guestMessages = [] } = req.body;
    if (!email || !password || !fullName)
      return res.status(400).json({ message: 'All fields required' });
    if (password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = await createUser({ email, password, fullName });
    const accessToken = await issueTokens(user, res);

    // Migrate guest messages asynchronously — don't block the response
    if (guestMessages.length > 0) {
      migrateGuestMessages(user.id, guestMessages).catch(err =>
        console.error('Guest migration failed:', err.message)
      );
    }

    res.status(201).json({
      accessToken,
      user: { id: user.id, email: user.email, fullName: user.full_name },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' })

    const user = await findUserByEmail(email)
    if (!user || !user.password)
      return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await verifyPassword(password, user.password)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    // Generate and send OTP
    const otp = await hashAndStoreOtp(user.id)
    await sendOtpEmail(email, otp)

    res.json({ otpRequired: true, email })
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ message: 'Failed to send verification code. Please try again.' })
  }
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies[REFRESH_COOKIE];
    if (!token) return res.status(401).json({ message: 'No refresh token' });
    const { accessToken, user } = await rotateTokens(token, res);
    res.json({ accessToken, user: { id: user.id, email: user.email, fullName: user.full_name } });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies[REFRESH_COOKIE];
    if (token) {
      const jwt = require('../utils/jwt');
      const payload = jwt.verifyRefresh(token);
      await revokeAllTokens(payload.userId);
    }
    clearRefreshCookie(res);
    res.json({ message: 'Logged out' });
  } catch {
    clearRefreshCookie(res);
    res.json({ message: 'Logged out' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp)
      return res.status(400).json({ message: 'Email and OTP required' })

    // Look up user first, then verify OTP by userId
    const user = await findUserByEmail(email)
    if (!user) return res.status(404).json({ message: 'User not found' })

    await verifyStoredOtp(user.id, otp)

    const accessToken = await issueTokens(user, res)
    res.json({ accessToken, user: { id: user.id, email: user.email, fullName: user.full_name } })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email required' })

    const user = await findUserByEmail(email)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const otp = await hashAndStoreOtp(user.id)
    await sendOtpEmail(email, otp)

    res.json({ message: 'Code resent' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to resend code' })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email required' })

    const user = await findUserByEmail(email)

    // Always return 200 — never reveal if email exists
    if (!user) return res.json({ message: 'If that email exists, a reset code has been sent' })

    const otp = await hashAndStoreOtp(user.id, 'reset')
    await sendResetEmail(email, otp)

    res.json({ message: 'If that email exists, a reset code has been sent', resetRequired: true, email })
  } catch (err) {
    console.error('Forgot password error:', err.message)
    res.status(500).json({ message: 'Failed to send reset code. Please try again.' })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: 'Email, code, and new password required' })
    if (newPassword.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' })

    const user = await findUserByEmail(email)
    if (!user) return res.status(404).json({ message: 'User not found' })

    await verifyStoredOtp(user.id, otp, 'reset')

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await supabase.from('users').update({ password: passwordHash }).eq('id', user.id)

    // Revoke all sessions — force re-login with new password
    await revokeAllTokens(user.id)
    clearRefreshCookie(res)

    res.json({ message: 'Password reset successful. Please sign in with your new password.' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

module.exports = { register, login, refresh, logout, verifyOtp, resendOtp, forgotPassword, resetPassword };
