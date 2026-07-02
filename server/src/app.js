const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '50kb' }))
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/chats', require('./routes/chat.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/guest', require('./routes/guest.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

const authenticate = require('./middleware/authenticate');
const { rateLimitAI } = require('./middleware/rateLimit');

app.post('/api/test/message', authenticate, rateLimitAI, (req, res) => {
  res.json({ message: 'Message accepted', userId: req.user.userId });
});



app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File must be under 5MB' })
  }
  if (err.message === 'File type not supported') {
    return res.status(400).json({ message: 'File type not supported' })
  }
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
})

module.exports = app;
