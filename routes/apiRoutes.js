const router = require('express').Router();

const {
  register,
  login,
  logout,
  followUser,
  profile,
  allUsers,
  searchUser,
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
const { conversation } = require('../controllers/messenger');

// Authentication routes
//User Routes
router.route('/users').get(allUsers);
router.route('/profile').get(profile);
router.route('/users/:id/follow').get(followUser);
router.route('/users/search').get(searchUser);
//Post Routes

router.route('/feed').get(feed);
router.route('/post').post(createPost);
router.route('/post/delete').delete(deletePost);
router.route('/likepost/:id').post(likePost);
router.route('/dislikepost/:id').post(dislikePost);
router.route('/:id/comment').post(comment);
router.route('/:id').get(singlePost);

//MESSENGER ROUTES
router.route('/messages/:id').get(conversation);

module.exports = router;
