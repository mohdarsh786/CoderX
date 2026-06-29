const jwt = require('jsonwebtoken');

const signAccess = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL || '15m' });

const signRefresh = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_TTL || '7d' });

const verifyAccess = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

const verifyRefresh = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh };
