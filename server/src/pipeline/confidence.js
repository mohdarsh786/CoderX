const LOW_CONFIDENCE_THRESHOLD = 0.7;

const assess = (validated) => {
  const isLowConfidence = validated.confidence < LOW_CONFIDENCE_THRESHOLD;
  return {
    ...validated,
    lowConfidence: isLowConfidence,
    disclaimer: isLowConfidence
      ? 'This response may be incomplete — verify before using in production.'
      : null,
  };
};

module.exports = { assess };
