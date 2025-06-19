const { default: mongoose } = require('mongoose');
const { userSchema } = require('../database/models');
const { logging } = require('../modules/app');
const users = mongoose.model('users', userSchema);

const register = async (req, res) => {
  try {
    if (req.method == 'GET') {
      return res.json({
        message: 'Input your name,password,email and gender(Male/Female)',
      });
    } else {
      const { name, password, email, gender } = req.body;
      if (!name || !password || !email || !gender) {
        return res.json({
          message: 'Wrong Inputs',
        });
      }
      const checkExistingEmail = await users.findOne({ email: `${email}` });
      if (!!checkExistingEmail) {
        return res.json({
          message: 'Email Already Exists',
        });
      }
      const checkExistingUser = await users.findOne({ name: `${name}` });
      if (!!checkExistingUser) {
        return res.json({
          message: 'Username Already Taken',
        });
      }
      const newUser = await users.create({
        name: name,
        email: email,
        password: password,
        gender: gender,
      });
      console.log(newUser);
      req.session.user = newUser;
      return res.status(201).json({
        message: `User:${name} created successfully`,
        name: name,
        email: email,
      });
    }
  } catch (err) {
    logging(err);
  }
};

const login = async (req, res) => {
  try {
    if (req.method == 'GET') {
      return res
        .status(200)
        .json({ message: 'Send your Username/Email and Password' });
    }
    const { name, email, password } = req.body;
    if ((!name && !email) || !password) {
      return res.json({ message: 'Wrong Input' });
    }
    const user =
      (await users.findOne({ email: email, password: password })) ||
      (await users.findOne({ name: name, password: password }));
    if (!user) {
      return res.json({
        message: 'Wrong Username/Email or Password',
      });
    }
    req.session.user = user;
    return res.status(202).json({
      message: 'Login Successful',
    });
  } catch (err) {
    logging(err);
  }
};
const logout = async (req, res) => {
  try {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/?msg=Logout+Successful');
    });
  } catch (err) {
    logging(err);
  }
};
module.exports = { register, login, logout };
