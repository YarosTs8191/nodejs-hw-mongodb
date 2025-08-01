import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (path) => {
  return cloudinary.uploader.upload(path, {
    folder: 'contacts_photos', // або будь-яка твоя папка
    transformation: [{ width: 400, height: 400, crop: 'limit' }],
  });
};
