import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

// CRUD маршрути:
router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(createContactController)); // Додати контакт
router.patch('/:contactId', ctrlWrapper(updateContactController)); // Оновити контакт
router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
