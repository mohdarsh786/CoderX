const { checkAndIncrement, refundQuota } = require('../services/rateLimit.service');

const rateLimitAI = async (req, res, next) => {
  try {
    const { allowed, remaining, resetAt } = await checkAndIncrement(req.user.userId);

    res.set('X-RateLimit-Limit', '15');
    res.set('X-RateLimit-Remaining', String(remaining));

    if (!allowed) {
      res.set('X-RateLimit-Reset', resetAt.toISOString());
      return res.status(429).json({
        message: 'Message limit reached',
        resetAt,
        waitMs: resetAt - Date.now(),
      });
    }

    res.on('finish', () => {
      if (res.statusCode >= 400 && res.statusCode !== 429) {
        refundQuota(req.user.userId).catch(err => 
          console.error('Failed to refund quota:', err.message)
        );
      }
    });

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { rateLimitAI };
