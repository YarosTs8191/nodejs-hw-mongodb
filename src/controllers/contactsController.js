import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

// Отримати всі контакти
export const getAllContactsController = async (req, res, next) => {
  try {
    const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;
    const result = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      type,
      isFavourite,
    });
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
// Отримати контакт за id
export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(404, 'Contact not found');
    }

    const contact = await getContactById(contactId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Створити контакт/ POST
export const createContactController = async (req, res, next) => {
  try {
    const newContact = await createContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

// Оновити контакт / PATCH
export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(404, 'Contact not found');
    }
    const updatedContact = await updateContact(contactId, req.body);
    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

// Видалити контакт / DELETE
export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(404, 'Contact not found');
    }
    const deletedContact = await deleteContact(contactId);
    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
};
