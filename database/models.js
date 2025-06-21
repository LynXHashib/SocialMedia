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
module.exports = { postSchema, userSchema, commentSchema };
