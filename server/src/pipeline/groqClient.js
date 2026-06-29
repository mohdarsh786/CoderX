const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT || "You are CoderX, an expert AI coding assistant.";
const RESPONSE_SCHEMA = process.env.RESPONSE_SCHEMA || "{}";

const chat = async (messages) => {
  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    temperature: 0.2,
    top_p: 0.9,
    max_tokens: 2048,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n${RESPONSE_SCHEMA}` },
      ...messages,
    ],
  });

  return {
    raw: completion.choices[0].message.content,
    tokensUsed: completion.usage?.total_tokens || 0,
  };
};

module.exports = { chat };
