require('dotenv').config();
const app = require('./app');
const connectMongo = require('./config/db.mongo');
const supabase = require('./config/db.supabase');
const { startCron } = require('./utils/cron');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectMongo();

  const { error } = await supabase.from('users').select('id').limit(1);
  if (error) {
    console.error('Supabase connection failed:', error.message);
    process.exit(1);
  }
  console.log('Supabase connected');

  app.listen(PORT, () => console.log(`CoderX server running on port ${PORT}`));
  startCron();
};

start();