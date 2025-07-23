import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'accesssecret';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw createHttpError(401, 'No access token provided');
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_ACCESS_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid access token');
    }

    // Перевірка, чи існує така сесія
    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    // Додаємо користувача до req.user
    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      throw createHttpError(401, 'User not found');
    }
    req.user = user;
    req.session = session;

    next();
  } catch (err) {
    next(err);
  }
};
