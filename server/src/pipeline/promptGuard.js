const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+a/i,
  /forget\s+(everything|all)/i,
  /new\s+persona/i,
  /disregard\s+(your\s+)?system\s+prompt/i,
  /act\s+as\s+(?!a\s+(?:python|javascript|typescript|java|c\+\+|coding))/i,
  /\[system\]/i,
  /<\|.*?\|>/,
  /###\s*instruction/i,
  /system\s*:/i,
  /override\s+(all\s+)?instructions/i,
  /developer\s+mode/i,
  /do\s+anything\s+now/i,
  /\bDAN\b/i,
  /bypass\s+(your\s+)?rules/i,
  /print\s+(your\s+)?(initial\s+)?prompt/i,
  /what\s+are\s+your\s+rules/i,
  /who\s+created\s+you/i,
];

const checkInjection = (text) => {
  const matched = INJECTION_PATTERNS.find(p => p.test(text));
  return { flagged: !!matched, reason: matched ? 'prompt_injection' : null };
};

module.exports = { checkInjection };
