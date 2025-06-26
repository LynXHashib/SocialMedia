const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
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

// SWAGGER
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

// Authentication routes
//User Routes
router.route('/profile').get(profile);
router.route('/user/follow').get(followUser);

//Post Routes

router.route('/feed').get(feed);
router.route('/post').post(createPost);
router.route('/post/delete').delete(deletePost);
router.route('/likepost/:id').post(likePost);
router.route('/dislikepost/:id').post(dislikePost);
router.route('/:id/comment').post(comment);
router.route('/:id').get(singlePost);

module.exports = router;
