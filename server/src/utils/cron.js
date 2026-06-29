const cron = require('node-cron');
const supabase = require('../config/db.supabase');

const startCron = () => {
  // Runs every 5 minutes — deletes rate_limit rows where window expired
  cron.schedule('*/5 * * * *', async () => {
    const cutoff = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase
      .from('rate_limits')
      .delete()
      .lt('window_start', cutoff);
    if (error) console.error('Cron cleanup error:', error.message);
  });
  console.log('Cron: rate limit cleanup scheduled');
};

module.exports = { startCron };
