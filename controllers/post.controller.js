import Post from '../models/Post.js';
import { errorHandler } from '../utils/error.js';

export const createPost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'No esta autorizado para crear un post'));
    }
    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, 'Todos los campos son requeridos'));
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post({
      ...req.body, slug, userId: req.user.id
    });
    const savePost = await newPost.save();
    res.status(201).json(savePost);
  } catch (error) {
    console.log(error);
    next(error);
  }
}