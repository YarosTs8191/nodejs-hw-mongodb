import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// CRUD маршрути:
router.get('/', authenticate, ctrlWrapper(getAllContactsController));
router.get(
  '/:contactId',
  authenticate,
  isValidId,
  ctrlWrapper(getContactByIdController),
);
router.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
); // Додати контакт
router.patch(
  '/:contactId',
  authenticate,
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
); // Оновити контакт
router.delete(
  '/:contactId',
  authenticate,
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default router;
