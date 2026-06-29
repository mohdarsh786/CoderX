const Chat = require('../models/Chat.model');
const Message = require('../models/Message.model');
const { v4: uuidv4 } = require('uuid');

const createChat = async (userId) => {
  const conversationId = uuidv4();
  const chat = await Chat.create({ conversationId, userId, title: 'New chat' });
  return chat;
};

const getUserChats = async (userId) => {
  return Chat.find({ userId }).sort({ createdAt: -1 }).lean();
};

const getChatMessages = async (conversationId, userId) => {
  const chat = await Chat.findOne({ conversationId, userId });
  if (!chat) return null;
  const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean();
  return { chat, messages };
};

const saveMessage = async ({ conversationId, userId, role, content, flagged = false, flagReason = null, fromGuest = false }) => {
  return Message.create({ conversationId, userId, role, content, flagged, flagReason, fromGuest });
};

const updateChatTitle = async (conversationId, title) => {
  return Chat.findOneAndUpdate({ conversationId }, { title }, { new: true });
};

const deleteChat = async (conversationId, userId) => {
  await Chat.deleteOne({ conversationId, userId });
  await Message.deleteMany({ conversationId });
};

module.exports = { createChat, getUserChats, getChatMessages, saveMessage, updateChatTitle, deleteChat };
