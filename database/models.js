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
  createdBy: {
    type: ObjectId,
    required: true,
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
  followers: {
    type: [ObjectId],
    default: [],
  },
  postCount: {
    type: Number,
  },
  securityLevel: {
    type: Number,
    default: 5,
  },
});

module.exports = { postSchema, userSchema };
