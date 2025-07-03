import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contacts.js';

export function setupServer() {
  const app = express();
  app.use(cors());
  app.use(pino());

  app.use('/api/contacts', contactsRouter);

  // ДОДАЙ ОЦЕ (тільки раз, не дублюй!)
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
}
