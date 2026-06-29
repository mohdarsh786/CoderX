const { checkInjection } = require('../pipeline/promptGuard');
const { scrubPII } = require('../pipeline/piiScrub');
const { saveMessage, createChat } = require('./chat.service');

const migrateGuestMessages = async (userId, guestMessages) => {
  if (!Array.isArray(guestMessages) || guestMessages.length === 0) return null;

  const chat = await createChat(userId);

  for (const msg of guestMessages) {
    if (!msg.content || !msg.role) continue;

    let content = msg.content;
    let flagged = false;
    let flagReason = null;

    if (msg.role === 'user') {
      const injection = checkInjection(content);
      if (injection.flagged) {
        flagged = true;
        flagReason = injection.reason;
      } else {
        const { scrubbed } = scrubPII(content);
        content = scrubbed;
      }
    }

    await saveMessage({
      conversationId: chat.conversationId,
      userId,
      role: msg.role,
      content,
      flagged,
      flagReason,
      fromGuest: true,
    });
  }

  return chat;
};

module.exports = { migrateGuestMessages };
