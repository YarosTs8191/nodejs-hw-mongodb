import { Contact } from '../models/contact.js';

// Отримати всі контакти
export const getAllContacts = async (
  {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  },
  userId,
) => {
  // Фільтрація
  const filter = { userId };
  if (type) filter.contactType = type;
  if (typeof isFavourite !== 'undefined')
    filter.isFavourite = isFavourite === 'true';

  // Сортування
  const skip = (Number(page) - 1) * Number(perPage);
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  // Підрахунок для пагінації
  const [data, totalItems] = await Promise.all([
    Contact.find(filter).sort(sort).skip(skip).limit(Number(perPage)),
    Contact.countDocuments(filter),
  ]);
  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

// Отримати контакт за id
export const getContactById = async (contactId, userId) =>
  Contact.findOne({ _id: contactId, userId });

// Створити контакт
export const createContact = async (contactData, userId) =>
  Contact.create({ ...contactData, userId });

// Оновити контакт
export const updateContact = async (contactId, updateData, userId) =>
  Contact.findOneAndUpdate({ _id: contactId, userId }, updateData, {
    new: true,
  });

// Видалити контакт
export const deleteContact = async (contactId, userId) =>
  Contact.findOneAndDelete({ _id: contactId, userId });
