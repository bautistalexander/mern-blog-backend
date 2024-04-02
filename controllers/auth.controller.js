import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
      next(errorHandler(400, 'Todos los campos son requeridos'));
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
      next(errorHandler(400, 'Todos los campos son requeridos'));
    }
    const validUser = await User.findOne({ email });
    if (!validUser) {
      // next(errorHandler(404, 'User not found'));
      return next(errorHandler(404, 'Credenciales no válidos'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      // next(errorHandler(400, 'Invalid Password'));
      return next(errorHandler(400, 'Credenciales no válidos'));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET_KEY
    );

    const { password: pass, ...rest } = validUser._doc; //Will not display the password

    res.status(200).cookie('access_token', token, { httoOnly: true }).json(rest);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { email, name, googlePhotoUrl } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY);
      const { password, ...rest } = user._doc;
      res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-8),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET_KEY);
      const { password, ...rest } = newUser._doc;
      res.status(201).cookie('access_token', token, { httpOnly: true }).json(rest);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};