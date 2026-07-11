const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const {
  createChat, getUserChats, getChatMessages, deleteChat,
} = require('../services/chat.service');
const { migrateGuestMessages } = require('../services/guestMigration.service');

// Migrate guest messages
router.post('/migrate', authenticate, async (req, res) => {
  try {
    const { guestMessages = [] } = req.body
    if (guestMessages.length === 0) return res.json({ migrated: false })
    const chat = await migrateGuestMessages(req.user.userId, guestMessages)
    res.json({ migrated: true, conversationId: chat?.conversationId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

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
