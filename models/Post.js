import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true
    },
    content: {
      type: String,
      require: true
    },
    title: {
      type: String,
      require: true,
      unique: true
    },
    image: {
      type: String,
      default: 'https://cdn.pixabay.com/photo/2018/03/15/10/35/website-3227784_1280.jpg'
    },
    category: {
      type: String,
      default: 'uncategory'
    },
    slug: {
      type: String,
      require: true,
      unique: true
    }
  }, {
    timestamps: true
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;