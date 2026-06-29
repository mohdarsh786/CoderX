const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const {
  createChat, getUserChats, getChatMessages, deleteChat,
} = require('../services/chat.service');

// Create new chat
router.post('/', authenticate, async (req, res) => {
  try {
    const chat = await createChat(req.user.userId);
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all chats for sidebar
router.get('/', authenticate, async (req, res) => {
  try {
    const chats = await getUserChats(req.user.userId);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single chat with messages
router.get('/:conversationId', authenticate, async (req, res) => {
  try {
    const data = await getChatMessages(req.params.conversationId, req.user.userId);
    if (!data) return res.status(404).json({ message: 'Chat not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete chat
router.delete('/:conversationId', authenticate, async (req, res) => {
  try {
    await deleteChat(req.params.conversationId, req.user.userId);
    res.json({ message: 'Chat deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
