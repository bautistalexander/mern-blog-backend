import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
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

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === '' || password === '') {
      next(errorHandler(400, 'All fieds are required'));
    }
    const validUser = await User.findOne({ email });
    if (!validUser) {
      // next(errorHandler(404, 'User not found'));
      return next(errorHandler(404, 'Credentials not valid'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      // next(errorHandler(400, 'Invalid Password'));
      return next(errorHandler(400, 'Credentials not valid'));
    }
    const token = jwt.sign(
      { id: validUser._id }, process.env.JWT_SECRET_KEY
    );

    const { password: pass, ...rest } = validUser._doc; //Will not display the password

    res.status(200).cookie('access_token', token, { httoOnly: true }).json(rest);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
