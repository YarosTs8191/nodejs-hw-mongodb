import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';

export function setupServer() {
  const app = express();
  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());
  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
}
