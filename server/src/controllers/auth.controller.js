const { findUserByEmail, createUser, verifyPassword } = require('../services/auth.service');
const { migrateGuestMessages } = require('../services/guestMigration.service');
const { issueTokens, rotateTokens, revokeAllTokens, clearRefreshCookie, REFRESH_COOKIE } = require('../services/token.service');

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
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await findUserByEmail(email);
    if (!user || !user.password)
      return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await verifyPassword(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = await issueTokens(user, res);
    res.json({ accessToken, user: { id: user.id, email: user.email, fullName: user.full_name } });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

module.exports = { register, login, refresh, logout };
