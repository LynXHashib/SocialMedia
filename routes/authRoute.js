const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  verification,
} = require('../controllers/user');

router.route('/user/register').get(register).post(register);
router.route('/user/login').get(login).post(login);
router.route('/user/logout').post(logout);
router.route('/verify').get(verification).post(verification);
module.exports = router;
