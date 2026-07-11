const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const supabase = require('../config/db.supabase')

const TTL_MINUTES = parseInt(process.env.OTP_TTL_MINUTES || '5')
const MAX_ATTEMPTS = 5

const generateOtp = () => crypto.randomInt(100000, 999999).toString()

const hashAndStoreOtp = async (userId, purpose = 'login') => {
  const otp = generateOtp()
  const otpHash = await bcrypt.hash(otp, 10)
  const expiresAt = new Date(Date.now() + TTL_MINUTES * 60 * 1000).toISOString()

  // Invalidate existing unused OTPs for this user
  await supabase
    .from('otp_codes')
    .update({ used: true })
    .eq('user_id', userId)
    .eq('purpose', purpose)
    .eq('used', false)

  await supabase.from('otp_codes').insert({
    user_id: userId,
    purpose,
    otp_hash: otpHash,
    expires_at: expiresAt,
    used: false,
    attempts: 0,
  })

  return otp
}

const verifyStoredOtp = async (userId, plainOtp, purpose = 'login') => {
  const { data: record } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('user_id', userId)
    .eq('purpose', purpose)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!record) throw new Error('Code expired or not found')

  if (record.attempts >= MAX_ATTEMPTS) {
    await supabase.from('otp_codes').update({ used: true }).eq('id', record.id)
    throw new Error('Too many attempts. Please request a new code.')
  }

  await supabase
    .from('otp_codes')
    .update({ attempts: record.attempts + 1 })
    .eq('id', record.id)

  const valid = await bcrypt.compare(plainOtp, record.otp_hash)
  if (!valid) throw new Error('Invalid code')

  await supabase.from('otp_codes').update({ used: true }).eq('id', record.id)
  return true
}

const cleanupExpiredOtps = async () => {
  await supabase
    .from('otp_codes')
    .delete()
    .or(`expires_at.lt.${new Date().toISOString()},used.eq.true`)
}

module.exports = { hashAndStoreOtp, verifyStoredOtp, cleanupExpiredOtps }
