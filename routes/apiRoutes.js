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

router.route('/feed').get(feed);
router.route('/post').get(createPost).post(createPost);
router.route('/post/delete').get(deletePost).post(deletePost);
router.route('/likepost/:id').post(likePost);
router.route('/dislikepost/:id').post(dislikePost);
router.route('/:id/comment').get(comment).post(comment);
router.route('/:id').get(singlePost);

module.exports = router;
