import { registerService } from '../services/auth.js';
import { loginService } from '../services/auth.js';
import { refreshService } from '../services/auth.js';
import { logoutService } from '../services/auth.js';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { sendResetPasswordEmail } from '../services/email.js';
import bcrypt from 'bcryptjs';
import { Session } from '../models/session.js';

const JWT_SECRET = process.env.JWT_SECRET || 'VOQjLdrpG1TWCHhDzv3o';
const APP_DOMAIN = process.env.APP_DOMAIN || 'http://localhost:3000/auth';

export const registerController = async (req, res, next) => {
  try {
    const newUser = await registerService(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await loginService(req.body);

    // Встановлюємо refreshToken у cookies (30 днів, httpOnly, secure)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
      sameSite: 'strict',
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { accessToken, newRefreshToken } = await refreshService(refreshToken);

    // Перезаписуємо новий refreshToken у cookies
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await logoutService(refreshToken);

    // Видаляємо куку
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// email-reset

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: '5m',
    });
    const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

    try {
      await sendResetPasswordEmail(user.email, resetLink);
    } catch (e) {
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );
    }

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// password-reset

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return next(createHttpError(401, 'Token is expired or invalid.'));
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    // Видаляємо всі сесії користувача (вихід з усіх пристроїв)
    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
