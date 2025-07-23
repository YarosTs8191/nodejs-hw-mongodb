import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import createHttpError from 'http-errors';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'accesssecret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshsecret';

const ACCESS_EXPIRES_IN = 15 * 60; // 15 хвилин (секунди)
const REFRESH_EXPIRES_IN = 30 * 24 * 60 * 60; // 30 днів (секунди)

export const registerService = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });
  return newUser;
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Invalid credentials');

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw createHttpError(401, 'Invalid credentials');

  // Видалити стару сесію, якщо є
  await Session.deleteMany({ userId: user._id });

  // Створюємо токени
  const accessToken = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

  const accessTokenValidUntil = new Date(Date.now() + ACCESS_EXPIRES_IN * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + REFRESH_EXPIRES_IN * 1000,
  );

  // Створити сесію
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const refreshService = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token provided');
  }

  // Перевіряємо чи є така сесія
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // Стара сесія видаляється
    await Session.deleteMany({ userId: session.userId });

    // Генеруємо нові токени
    const accessToken = jwt.sign(
      { userId: session.userId },
      JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_EXPIRES_IN },
    );
    const newRefreshToken = jwt.sign(
      { userId: session.userId },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRES_IN },
    );

    const accessTokenValidUntil = new Date(
      Date.now() + ACCESS_EXPIRES_IN * 1000,
    );
    const refreshTokenValidUntil = new Date(
      Date.now() + REFRESH_EXPIRES_IN * 1000,
    );

    // Створюємо нову сесію
    await Session.create({
      userId: session.userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    return { accessToken, newRefreshToken };
  } catch (err) {
    throw createHttpError(401, 'Refresh token expired or invalid');
  }
};

export const logoutService = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token provided');
  }

  // Видаляємо сесію за цим refreshToken
  const result = await Session.findOneAndDelete({ refreshToken });
  if (!result) {
    throw createHttpError(401, 'Invalid refresh token');
  }
};
