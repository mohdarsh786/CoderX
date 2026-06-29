const supabase = require('../config/db.supabase');

const WINDOW_MS = 5 * 60 * 60 * 1000; // 5 hours
const MAX_MESSAGES = 15;

const checkAndIncrement = async (userId) => {
  const now = new Date();

  const { data: existing } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!existing) {
    await supabase.from('rate_limits').insert({
      user_id: userId,
      window_start: now.toISOString(),
      message_count: 1,
    });
    return { allowed: true, remaining: MAX_MESSAGES - 1, resetAt: null };
  }

  const windowStart = new Date(existing.window_start);
  const elapsed = now - windowStart;

  if (elapsed > WINDOW_MS) {
    await supabase.from('rate_limits').update({
      window_start: now.toISOString(),
      message_count: 1,
    }).eq('user_id', userId);
    return { allowed: true, remaining: MAX_MESSAGES - 1, resetAt: null };
  }

  if (existing.message_count >= MAX_MESSAGES) {
    const resetAt = new Date(windowStart.getTime() + WINDOW_MS);
    return { allowed: false, remaining: 0, resetAt };
  }

  await supabase.from('rate_limits').update({
    message_count: existing.message_count + 1,
  }).eq('user_id', userId);

  return {
    allowed: true,
    remaining: MAX_MESSAGES - existing.message_count - 1,
    resetAt: null,
  };
};

const getStatus = async (userId) => {
  const { data: existing } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!existing) return { remaining: MAX_MESSAGES, resetAt: null };

  const windowStart = new Date(existing.window_start);
  const elapsed = Date.now() - windowStart;

  if (elapsed > WINDOW_MS) return { remaining: MAX_MESSAGES, resetAt: null };

  const remaining = Math.max(0, MAX_MESSAGES - existing.message_count);
  const resetAt = remaining === 0
    ? new Date(windowStart.getTime() + WINDOW_MS)
    : null;

  return { remaining, resetAt };
};

const refundQuota = async (userId) => {
  const { data: existing } = await supabase
    .from('rate_limits')
    .select('message_count')
    .eq('user_id', userId)
    .single();

  if (existing && existing.message_count > 0) {
    await supabase.from('rate_limits').update({
      message_count: existing.message_count - 1,
    }).eq('user_id', userId);
  }
};

module.exports = { checkAndIncrement, getStatus, refundQuota };
