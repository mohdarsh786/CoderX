const VALID_TYPES = ['code_generation','explanation','debug','optimization','documentation','review','general','informational','greeting'];
const VALID_LANGS = ['python','javascript','typescript','java','cpp','c','sql','other',null,'null','none','N/A'];

const validate = (raw) => {
  let parsed;
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error('Validation Parse Error:', err.message, 'Raw Output:', raw);
    return { valid: false, data: null, error: 'Response was not valid JSON' };
  }

  if (!VALID_TYPES.includes(parsed.type)) {
    console.error('Invalid type:', parsed.type);
    return { valid: false, data: null, error: 'Invalid response type' };
  }

  if (!VALID_LANGS.includes(parsed.language)) {
    console.error('Invalid language:', parsed.language);
    return { valid: false, data: null, error: 'Invalid language field' };
  }

  if (typeof parsed.explanation !== 'string' || parsed.explanation.length < 1) {
    console.error('Invalid explanation:', parsed.explanation);
    return { valid: false, data: null, error: 'Missing explanation' };
  }

  if (typeof parsed.confidence !== 'number' || parsed.confidence < 0 || parsed.confidence > 1)
    parsed.confidence = 0.5;

  if (!Array.isArray(parsed.suggestions)) parsed.suggestions = [];

  return { valid: true, data: parsed, error: null };
};

module.exports = { validate };
