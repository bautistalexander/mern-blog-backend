import bcryptjs from 'bcryptjs';
import User from '../models/User.js';

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
      return res.status(400).json({ messaje: 'All fields are required' });
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
    res.status(500).json({ message: error.message });
  }
};
