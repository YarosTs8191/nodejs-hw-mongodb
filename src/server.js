import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contacts.js';

export function setupServer() {
  const app = express();
  app.use(cors());
  app.use(pino());
  app.use('/contacts', contactsRouter);
}
