const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const { rateLimitAI } = require('../middleware/rateLimit');
const { processMessage } = require('../services/ai.service');
const { saveMessage, getChatMessages } = require('../services/chat.service');
const { generateTitle } = require('../services/autoTitle.service');
const Chat = require('../models/Chat.model');
const Message = require('../models/Message.model');

router.post('/message', authenticate, rateLimitAI, async (req, res) => {
  try {
    const { message, conversationId, history = [], fileData = null } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0)
      return res.status(400).json({ message: 'Message is required' });
    if (!conversationId)
      return res.status(400).json({ message: 'conversationId is required' });
    if (message.length > 4000)
      return res.status(400).json({ message: 'Message too long (max 4000 chars)' });
    
    if (fileData && fileData.content && fileData.content.length > 6000) {
      return res.status(400).json({ message: 'File content too large. Please upload a smaller file or paste the relevant section directly.' })
    }

    // Verify chat belongs to user
    const chat = await Chat.findOne({ conversationId, userId: req.user.userId });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const result = await processMessage(message.trim(), history, fileData);

    if (result.flagged) {
      // Save flagged message for audit — do not send to Groq
      await saveMessage({
        conversationId,
        userId: req.user.userId,
        role: 'user',
        content: message.trim(),
        flagged: true,
        flagReason: result.flagReason,
      });
      return res.status(400).json({
        message: 'Message flagged by security filter',
        reason: result.flagReason,
      });
    }

    if (result.error) return res.status(502).json({ message: result.error });

    const userContent = fileData
      ? `${message.trim()} [attached: ${fileData.filename}]`
      : message.trim();

    // Save user message
    await saveMessage({
      conversationId,
      userId: req.user.userId,
      role: 'user',
      content: userContent,
    });

    // Save assistant response
    await saveMessage({
      conversationId,
      userId: req.user.userId,
      role: 'assistant',
      content: JSON.stringify(result.response),
    });

    // Auto-title on first message (async, non-blocking)
    const msgCount = await Message.countDocuments({ conversationId });
    if (msgCount <= 2) {
      generateTitle(conversationId, message.trim()).catch(() => {});
    }

    res.json({
      response: result.response,
      piiRedacted: result.piiFound?.length > 0,
      tokensUsed: result.tokensUsed,
    });
  } catch (err) {
    console.error('AI route error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
