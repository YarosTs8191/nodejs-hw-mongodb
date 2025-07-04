import express from 'express';
import contactsRouter from './contacts.js';

const router = express.Router();

// /api/contacts буде працювати!
router.use('/contacts', contactsRouter);

export default router;
