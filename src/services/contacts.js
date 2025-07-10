import { Contact } from '../models/contact.js';

// Отримати всі контакти
export const getAllContacts = async () => Contact.find();

// Отримати контакт за id
export const getContactById = async (contactId) => Contact.findById(contactId);

// Створити контакт
export const createContact = async (contactData) => Contact.create(contactData);

// Оновити контакт
export const updateContact = async (contactId, updateData) =>
  Contact.findByIdAndUpdate(contactId, updateData, { new: true });

// Видалити контакт
export const deleteContact = async (contactId) =>
  Contact.findByIdAndDelete(contactId);
