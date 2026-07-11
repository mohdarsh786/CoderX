const { brevo } = require('../config/email')

const sendOtpEmail = async (to, otp) => {
  await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      name: process.env.OTP_FROM_NAME || 'CoderX',
      email: process.env.OTP_FROM_EMAIL,
    },
    to: [{ email: to }],
    subject: `Your CoderX verification code: ${otp}`,
    htmlContent: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
        <h2 style="font-size: 1.2rem; font-weight: 500; color: #1a1400; margin-bottom: 0.5rem;">CoderX verification code</h2>
        <p style="color: #7a6830; font-size: 14px; margin-bottom: 1.5rem;">Use this code to complete your sign in. It expires in ${process.env.OTP_TTL_MINUTES || 5} minutes.</p>
        <div style="background: #fef9e0; border: 1px solid #e8d880; border-radius: 10px; padding: 1.5rem; text-align: center; margin-bottom: 1.5rem;">
          <span style="font-size: 2rem; font-weight: 600; letter-spacing: 0.5rem; color: #1a1400;">${otp}</span>
        </div>
        <p style="color: #b8a060; font-size: 12px;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `,
  })
}

const sendResetEmail = async (to, otp) => {
  await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      name: process.env.OTP_FROM_NAME || 'CoderX',
      email: process.env.OTP_FROM_EMAIL,
    },
    to: [{ email: to }],
    subject: `Reset your CoderX password`,
    htmlContent: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
        <h2 style="font-size: 1.2rem; font-weight: 500; color: #1a1400; margin-bottom: 0.5rem;">Reset your password</h2>
        <p style="color: #7a6830; font-size: 14px; margin-bottom: 1.5rem;">Use this code to reset your CoderX password. It expires in ${process.env.OTP_TTL_MINUTES || 5} minutes.</p>
        <div style="background: #fef9e0; border: 1px solid #e8d880; border-radius: 10px; padding: 1.5rem; text-align: center; margin-bottom: 1.5rem;">
          <span style="font-size: 2rem; font-weight: 600; letter-spacing: 0.5rem; color: #1a1400;">${otp}</span>
        </div>
        <p style="color: #b8a060; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  })
}

module.exports = { sendOtpEmail, sendResetEmail }

