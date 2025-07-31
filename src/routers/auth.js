import express from 'express';
import { registerController } from '../controllers/authController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../schemas/auth.js';
import { loginController } from '../controllers/authController.js';
import { loginSchema } from '../schemas/auth.js';
import { refreshController } from '../controllers/authController.js';
import { logoutController } from '../controllers/authController.js';
import { sendResetEmailController } from '../controllers/authController.js';
import { resetEmailSchema } from '../schemas/auth.js';
import { resetPwdSchema } from '../schemas/auth.js';
import { resetPasswordController } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerController);
router.post('/login', validateBody(loginSchema), loginController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);
router.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  sendResetEmailController,
);
router.post(
  '/reset-pwd',
  validateBody(resetPwdSchema),
  resetPasswordController,
);

export default router;
