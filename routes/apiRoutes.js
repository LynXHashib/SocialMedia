const express = require('express');
const { register } = require('../controllers/user');
const router = express.Router();

router.route('/register').get(register).post(register);

module.exports = router;
