const { default: mongoose } = require('mongoose');
const { postSchema } = require('../database/models');
const { logging } = require('../modules/app');
const { default: axios } = require('axios');

const posts = mongoose.model('posts', postSchema);

const createPost = async (req, res) => {
  try {
    const { title, description, image } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        message: 'No title or description',
      });
    }
    try {
      const imageValidation = await axios.get(image);
    } catch (err) {
      return res.status(400).json({
        message: 'Image does not exists',
      });
    }

    const createdby = req.session.user._id;
    const newPost = posts.create({
      title: title,
      description: description,
      image: image,
      createdby: createdby,
    });
    console.log(newPost);
    return res.status(201).json({
      message: 'New Post created successfully',
    });
  } catch (err) {
    logging(err);
  }
};
const deletePost = async (req, res) => {
  try {
    const postID = req.query.id;
    let post = await posts.findById(postID);
    if (!post) {
      return res.status(400).json({
        message: 'No such posts exist',
      });
    }
    if (post.createdBy != req.session.user._id) {
      return res.status(400).json({
        message: 'You are not authorized to do this',
      });
    }
    post = await posts.findOneAndDelete({ _id: postID });
  } catch (err) {
    logging(err);
  }
};
const likePost = async (req, res) => {
  try {
    const postID = req.query.id;
    let post = await posts.findById(postID);
    post.likedby.push(req.session.user._id);
  } catch (err) {
    logging(err);
  }
};
const dislikePost = async (req, res) => {
  try {
    const postID = req.query.id;
    let post = await posts.findById(postID);
    post.dislikedby.push(req.session.user._id);
  } catch (err) {
    logging(err);
  }
};
