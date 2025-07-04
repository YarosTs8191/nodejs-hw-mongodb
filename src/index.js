import { config } from 'dotenv';
config();

import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

try {
  await initMongoConnection();
  setupServer();
} catch (error) {
  console.error('Mongo connection failed:', error);
  process.exit(1);
}
