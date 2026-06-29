const { verifyAccess } = require('../utils/jwt');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  try {
    const token = header.split(' ')[1];
    req.user = verifyAccess(token);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
