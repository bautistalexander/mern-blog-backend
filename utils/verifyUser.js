import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import cookieParser from 'cookie-parser';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(errorHandler(401, 'No autorizado'));
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return next(errorHandler(401, 'No autorizado'));
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};