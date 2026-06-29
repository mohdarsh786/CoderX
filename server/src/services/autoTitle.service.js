const Groq = require('groq-sdk');
const { updateChatTitle } = require('./chat.service');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateTitle = async (conversationId, firstUserMessage) => {
  try {
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 20,
      messages: [
        {
          role: 'system',
          content: 'You generate short chat titles. Respond with ONLY a title of 4 words or less. No quotes, no punctuation, no explanation.',
        },
        {
          role: 'user',
          content: firstUserMessage,
        },
      ],
    });

    const title = completion.choices[0].message.content.trim().slice(0, 40);
    await updateChatTitle(conversationId, title);
  } catch (err) {
    console.error('Auto-title failed:', err.message);
  }
};

module.exports = { generateTitle };
