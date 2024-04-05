import bcryptjs from 'bcryptjs';

import User from '../models/User.js';
import { errorHandler } from '../utils/error.js';

export const test = (req, res) => {
  res.json({ message: 'API is working' });
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return next(403, 'No tienes permisos para editar este usuario');
    }
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, 'El password debe contener al menos 6 carateres'));
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.username) {
      if (req.body.username.length < 3 || req.body.length > 20) {
        return next(errorHandler(400, 'El nombre de usuario debe contener de 3 a 20 caracteres'));
      }
      if (req.body.username.includes(' ')) {
        return next(errorHandler(400, 'El nombre de usuario no puede contener espacios'));
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, 'El nombre de usuario debe estar en minúscula'));
      }
      if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return next(errorHandler(400, 'El nombre de usuario debe contener solo letras y números'));
      }
    }


    const updateUser = await User.findByIdAndUpdate(req.params.userId, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        profilePicture: req.body.profilePicture,
        password: req.body.password
      },
    }, { new: true });

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {

  try {
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'No tienes permisos para eliminar este usuario'));
    }
    const result = await User.findOneAndDelete({ _id: req.params.userId });
    if (!result) {
      return next(errorHandler(404, 'No se encontró el usuario'));
    }
    res.status(200).json({ message: 'El usuario ha sido eliminado' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token').status(200).json({ message: 'El usuario a cerrado sesión' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(403, 'No tienes permisos para ver a todos los usuarios');
    }
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    const users = await User.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    res.status(200).json({
      user: usersWithoutPassword,
      totalUsers,
      lastMonthUsers
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};