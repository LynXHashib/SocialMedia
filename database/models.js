const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  likedby: {
    type: [ObjectId],
  },
  dislikedby: {
    type: [ObjectId],
  },
  createdby: {
    type: ObjectId,
    ref: 'users',
    required: true,
  },
  date: {
    type: String,
    default: new Date(),
  },
});
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    maxlength: 100,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verifytoken: {
    type: String,
    default: null,
  },
  followers: {
    type: [ObjectId],
    default: [],
  },
  following: {
    type: [ObjectId],
    default: [],
  },
  postcount: {
    type: Number,
    default: 0,
  },
  securityLevel: {
    type: Number,
    default: 5,
  },
});
const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  commentby: {
    type: ObjectId,
    required: true,
    ref: 'users',
  },
  commenton: {
    type: ObjectId,
    required: true,
    ref: 'posts',
  },
});
const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'conversations',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});
const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'messages',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = {
  postSchema,
  userSchema,
  commentSchema,
  messageSchema,
  conversationSchema,
};
