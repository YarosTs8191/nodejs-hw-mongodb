import { config } from 'dotenv';
config();
console.log('SMTP_HOST from index.js:', process.env.SMTP_HOST);

import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

try {
  await initMongoConnection();
  setupServer();
} catch (error) {
  console.error('Mongo connection failed:', error);
  process.exit(1);
}
