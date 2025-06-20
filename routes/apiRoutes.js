const express = require('express');
const { register, login, logout } = require('../controllers/user');
const {
  createPost,
  deletePost,
  likePost,
  dislikePost,
  singlePost,
  comment,
  home,
} = require('../controllers/post');
const router = express.Router();

// User routes
router.route('/user/register').get(register).post(register);
router.route('/user/login').get(login).post(login);
router.route('/user/logout').post(logout);
//Post Routes
router.route('/').get(singlePost);
router.route('/home').get(home);
router.route('/comment').get(comment).post(comment);
router.route('/post').get(createPost).post(createPost);
router.route('/post/delete').get(deletePost).post(deletePost);
router.route('/likepost').post(likePost);
router.route('/dislikepost').post(dislikePost);

module.exports = router;
