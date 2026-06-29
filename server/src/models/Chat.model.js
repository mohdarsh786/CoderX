const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, unique: true },
  userId:         { type: String, required: true },
  title:          { type: String, default: 'New chat' },
}, { timestamps: true });

chatSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Chat', chatSchema);
