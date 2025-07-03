import { Contact } from '../models/contact.js';

// Отримати всі контакти
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({
      status: 'success',
      code: 200,
      data: { contacts },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: error.message,
    });
  }
};

// Отримати контакт за id
export const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: `Contact with id=${contactId} not found`,
      });
    }

    res.json({
      status: 'success',
      code: 200,
      data: { contact },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: error.message,
    });
  }
};

// Створити новий контакт
export const createContact = async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    res.status(201).json({
      status: 'success',
      code: 201,
      data: { contact: newContact },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: error.message,
    });
  }
};
