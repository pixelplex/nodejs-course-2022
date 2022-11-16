import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  // createdAt: Date,
  // updatedAt: Date,
  creator: {
    ref: 'user', type: mongoose.Schema.Types.ObjectId, index: true, default: null,
  },
}, { timestamps: true });

const Post = mongoose.model('post', postSchema);
export { Post };
