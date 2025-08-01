import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const tempDir = './tmp';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;
