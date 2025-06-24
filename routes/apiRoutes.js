const express = require('express');
const {
  register,
  login,
  logout,
  followUser,
  profile,
} = require('../controllers/user');
const {
  createPost,
  deletePost,
  likePost,
  dislikePost,
  singlePost,
  comment,
  feed,
} = require('../controllers/post');
const router = express.Router();

// Authentication routes
//User Routes
router.route('/profile').get(profile);
router.route('/user/follow').get(followUser);

//Post Routes
router.route('/').get(singlePost);
router.route('/feed').get(feed);
router.route('/comment').get(comment).post(comment);
router.route('/post').get(createPost).post(createPost);
router.route('/post/delete').get(deletePost).post(deletePost);
router.route('/likepost').post(likePost);
router.route('/dislikepost').post(dislikePost);

module.exports = router;
