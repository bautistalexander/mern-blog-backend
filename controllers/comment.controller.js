import Comment from '../models/Comment.js';
import { errorHandler } from '../utils/error.js';

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, 'No tienes permitido enviar un comentario'));
    }

    const newComment = new Comment({ content, postId, userId });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    next(error);
  }
};