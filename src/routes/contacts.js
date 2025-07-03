import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
} from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', getAllContacts);
router.get('/:contactId', getContactById);
router.post('/', createContact);

export default router;
