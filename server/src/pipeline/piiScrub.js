const PII_PATTERNS = [
  { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, label: 'email' },
  { pattern: /\b(\+?\d{1,3}[\s.-]?)?(\(?\d{3}\)?[\s.-]?)(\d{3}[\s.-]?\d{4})\b/g, label: 'phone' },
  { pattern: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g, label: 'card_number' },
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, label: 'ssn' },
  { pattern: /eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/g, label: 'jwt_token' },
  { pattern: /(?:sk-[a-zA-Z0-9]{20,}|bearer\s+[a-zA-Z0-9-._~+/]+=*)/ig, label: 'api_secret' },
  { pattern: /(?:AKIA|A3T|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g, label: 'aws_key' },
];

const scrubPII = (text) => {
  let scrubbed = text;
  const found = [];
  PII_PATTERNS.forEach(({ pattern, label }) => {
    if (pattern.test(scrubbed)) found.push(label);
    pattern.lastIndex = 0;
    scrubbed = scrubbed.replace(pattern, `[${label.toUpperCase()}_REDACTED]`);
  });
  return { scrubbed, piiFound: found };
};

module.exports = { scrubPII };
