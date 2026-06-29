const bcrypt = require('bcryptjs');
const supabase = require('../config/db.supabase');

const findUserByEmail = async (email) => {
  const { data } = await supabase.from('users').select('*').eq('email', email).single();
  return data;
};

const createUser = async ({ email, password, fullName, provider = 'email' }) => {
  const passwordHash = password ? await bcrypt.hash(password, 12) : null;
  const { data, error } = await supabase.from('users').insert({
    email, password: passwordHash, full_name: fullName, provider,
  }).select().single();
  if (error) throw new Error(error.message);
  return data;
};

const verifyPassword = async (plain, hash) => bcrypt.compare(plain, hash);

module.exports = { findUserByEmail, createUser, verifyPassword };
