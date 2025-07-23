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
export const getAllContactsController = async (req, res) => {
  try {
    const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;
    const userId = req.user._id;
    const result = await getAllContacts(
      {
        page,
        perPage,
        sortBy,
        sortOrder,
        type,
        isFavourite,
      },
      userId,
    );
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
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(404, 'Contact not found');
    }

    const contact = await getContactById(contactId, userId);

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
    const userId = req.user._id;
    const newContact = await createContact(req.body, userId);
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
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(404, 'Contact not found');
    }
    const updatedContact = await updateContact(contactId, req.body, userId);
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
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(404, 'Contact not found');
    }
    const deletedContact = await deleteContact(contactId, userId);
    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
};
