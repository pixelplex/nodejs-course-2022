import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, required: true },
  // createdAt: { type: Date, required: true },
  // updatedAt: { type: Date, required: true },
}, { timestamps: true });

const User = mongoose.model('user', userSchema);
export { User };
