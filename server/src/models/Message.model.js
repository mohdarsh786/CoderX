const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  userId:         { type: String, required: true },
  role:           { type: String, enum: ['user', 'assistant'], required: true },
  content:        { type: String, required: true },
  flagged:        { type: Boolean, default: false },
  flagReason:     { type: String, default: null },
  fromGuest:      { type: Boolean, default: false },
}, { timestamps: true });

messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ userId: 1, role: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
