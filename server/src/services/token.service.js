const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt');
const supabase = require('../config/db.supabase');

const REFRESH_COOKIE = 'coderx_refresh';

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const issueTokens = async (user, res) => {
  const familyId = uuidv4();
  const accessToken = signAccess({ userId: user.id, email: user.email, fullName: user.full_name });
  const refreshToken = signRefresh({ userId: user.id, familyId, generation: 1 });
  const tokenHash = await bcrypt.hash(refreshToken, 10);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await supabase.from('refresh_tokens').insert({
    user_id: user.id, family_id: familyId,
    generation: 1, token_hash: tokenHash, expires_at: expiresAt,
  });

  res.cookie(REFRESH_COOKIE, refreshToken, cookieOpts);
  return accessToken;
};

const rotateTokens = async (refreshToken, res) => {
  let payload;
  try {
    payload = verifyRefresh(refreshToken);
  } catch {
    throw new Error('Invalid refresh token');
  }

  const { userId, familyId, generation } = payload;

  const { data: stored } = await supabase
    .from('refresh_tokens')
    .select('*')
    .eq('family_id', familyId)
    .eq('generation', generation)
    .single();

  if (!stored || stored.revoked) {
    // Token reuse detected — revoke entire family
    await supabase.from('refresh_tokens').update({ revoked: true }).eq('family_id', familyId);
    throw new Error('Token reuse detected');
  }

  const valid = await bcrypt.compare(refreshToken, stored.token_hash);
  if (!valid) throw new Error('Invalid refresh token');

  // Revoke current token
  await supabase.from('refresh_tokens').update({ revoked: true }).eq('id', stored.id);

  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();

  const newGeneration = generation + 1;
  const newAccessToken = signAccess({ userId, email: user.email, fullName: user.full_name });
  const newRefreshToken = signRefresh({ userId, familyId, generation: newGeneration });
  const newHash = await bcrypt.hash(newRefreshToken, 10);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await supabase.from('refresh_tokens').insert({
    user_id: userId, family_id: familyId,
    generation: newGeneration, token_hash: newHash, expires_at: expiresAt,
  });

  res.cookie(REFRESH_COOKIE, newRefreshToken, cookieOpts);
  return { accessToken: newAccessToken, user };
};

const revokeAllTokens = async (userId) => {
  await supabase.from('refresh_tokens').update({ revoked: true }).eq('user_id', userId);
};

const clearRefreshCookie = (res) => res.clearCookie(REFRESH_COOKIE);

module.exports = { issueTokens, rotateTokens, revokeAllTokens, clearRefreshCookie, REFRESH_COOKIE };
