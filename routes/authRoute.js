const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  verification,
} = require('../controllers/user');

// SWAGGER

//AUTH
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').delete(logout);
router.route('/verify').get(verification).post(verification);
module.exports = router;
