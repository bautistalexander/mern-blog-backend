import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
      next(errorHandler(400, 'All fields are required'));
    }

    const hashPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashPassword
    });
    await newUser.save();
    res.status(200).json({ message: 'Sign successful' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
