import { Contact } from '../models/contact.js';

// Отримати всі контакти
export const getAllContacts = async () => Contact.find();

// Отримати контакт за id
export const getContactById = async (contactId) => Contact.findById(contactId);
