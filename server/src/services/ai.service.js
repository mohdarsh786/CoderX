const { checkInjection } = require('../pipeline/promptGuard');
const { scrubPII } = require('../pipeline/piiScrub');
const { chat } = require('../pipeline/groqClient');
const { validate } = require('../pipeline/outputValidator');
const { assess } = require('../pipeline/confidence');

const MAX_RETRIES = 1

const buildFileContext = (fileData) => {
  if (!fileData) return ''
  if (fileData.type === 'code') {
    return `\n\n[User has attached a ${fileData.language} file: ${fileData.filename}]\n\`\`\`${fileData.language}\n${fileData.content}\n\`\`\``
  }
  if (fileData.type === 'document') {
    return `\n\n[User has attached a document: ${fileData.filename}]\n${fileData.content}`
  }
  return ''
}

const processMessage = async (userMessage, conversationHistory = [], fileData = null) => {
  const injection = checkInjection(userMessage)
  if (injection.flagged) {
    return { flagged: true, flagReason: injection.reason, response: null }
  }

  const { scrubbed, piiFound } = scrubPII(userMessage)
  const fileContext = buildFileContext(fileData)
  const messageWithContext = scrubbed + fileContext

  const messages = [
    ...conversationHistory,
    { role: 'user', content: messageWithContext },
  ]

  let validated = null
  let tokensUsed = 0

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const { raw, tokensUsed: t } = await chat(messages)
    tokensUsed += t
    const result = validate(raw)
    if (result.valid) { validated = result.data; break }
    if (attempt === MAX_RETRIES) {
      return { flagged: false, response: null, error: 'AI response failed validation after retry', tokensUsed }
    }
  }

  const assessed = assess(validated)
  return { flagged: false, piiFound, response: assessed, tokensUsed, error: null }
}

module.exports = { processMessage };
