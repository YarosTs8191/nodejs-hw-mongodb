import { registerService } from '../services/auth.js';
import { loginService } from '../services/auth.js';
import { refreshService } from '../services/auth.js';
import { logoutService } from '../services/auth.js';

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
