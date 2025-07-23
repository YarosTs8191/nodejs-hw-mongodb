import express from 'express';
import { registerController } from '../controllers/authController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../schemas/auth.js';
import { loginController } from '../controllers/authController.js';
import { loginSchema } from '../schemas/auth.js';
import { refreshController } from '../controllers/authController.js';
import { logoutController } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerController);
router.post('/login', validateBody(loginSchema), loginController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);

export default router;
