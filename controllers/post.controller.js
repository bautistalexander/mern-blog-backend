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
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const posts = await Post.find(
      {
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { content: { $regex: req.query.searchTerm, $options: 'i' } }
          ],
        })
      }).sort({ updateAt: sortDirection }).skip(startIndex).limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(403, 'No tienes permitido eliminar este post');
    }
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('El post ha sido eliminado');
  } catch (error) {
    console.log(error);
    next(error);
  }
};
