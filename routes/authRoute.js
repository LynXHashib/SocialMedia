const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const {
  register,
  login,
  logout,
  verification,
} = require('../controllers/user');

// SWAGGER
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

//AUTH
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').delete(logout);
router.route('/verify').get(verification).post(verification);
module.exports = router;
