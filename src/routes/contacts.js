import express from 'express';
import {
  getAllContacts,
  getContactById,
} from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', getAllContacts);
// !! Тут змінити на :id, якщо у контролері req.params.id !!
router.get('/:id', getContactById);

export default router;
