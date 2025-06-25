const { default: mongoose } = require('mongoose');
const { userSchema } = require('../database/models');
const { logging, transporter } = require('../modules/app');
const crypto = require('crypto');
//   CONSTANTS

const sendMail = async (email, uniqueToken) => {
  await transporter.sendMail({
    from: '"Email Verification"<smedianode@gmail.com>',
    to: email,
    subject: 'Verify your email',
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <style>
      .container {
        max-width: 400px;
        margin: 40px auto;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        padding: 32px 24px;
        font-family: Arial, sans-serif;
        color: #222;
      }
      .title {
        color: #2d7ff9;
        text-align: center;
        margin-bottom: 16px;
      }
      .message {
        font-size: 16px;
        margin-bottom: 24px;
        text-align: center;
      }
      .verify-btn {
        display: block;
        width: 100%;
        background: #2d7ff9;
        color: #fff;
        text-decoration: none;
        padding: 12px 0;
        border-radius: 4px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 12px;
      }
      .footer {
        font-size: 12px;
        color: #888;
        text-align: center;
        margin-top: 24px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2 class="title">Verify Your Email</h2>
      <div class="message">
        Thank you for registering! Please click the button below to verify your email address.
      </div>
      <a href="http://localhost:5000/auth/verify?email=${email}&token=${uniqueToken}" class="verify-btn">
        Verify Email
      </a>
      <div class="footer">
        If you did not create an account, you can ignore this email.
      </div>
    </div>
  </body>
</html>`,
  });
};

const users = mongoose.model('users', userSchema);

// AUTHENTICATION

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
      const uniqueToken = crypto.createHash('sha1').update(data).digest('hex');

      sendMail(email, uniqueToken);
      const newUser = await users.create({
        name: name,
        email: email,
        password: password,
        gender: gender,
        verifytoken: uniqueToken,
      });
      console.log(newUser);
      req.session.user = newUser;
      return res.status(201).json({
        message: `User:${name} created successfully. You can't access feed until you verify your email`,
        name: name,
        email: email,
      });
    }
  } catch (err) {
    logging(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const verification = async (req, res) => {
  try {
    const email = req.query.email;
    const token = req.query.token;
    const user = await users.findOne({ email: email });
    if (user.verifytoken == token) {
      user.verified = true;
      user.verifytoken = null;
      await user.save();
      return res.json({ message: 'Account Verified' });
    } else {
      return res.json({
        message: 'Verification Failed. Try again from the beginning',
      });
    }
  } catch (err) {
    logging(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const login = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    if ((!name && !email) || !password) {
      return res.json({ success: false, message: 'Wrong Input' });
    }
    const user =
      (await users.findOne({ email: email, password: password })) ||
      (await users.findOne({ name: name, password: password }));
    if (!user) {
      return res.json({
        success: false,
        message: 'Wrong Username/Email or Password',
      });
    }
    if (!user.verified) {
      user.verifytoken = crypto.createHash('sha1').update(data).digest('hex');
      await user.save();
      sendMail(user.email, user.verifytoken);
      return res.json({
        message: 'A verfication code has been sent',
      });
    }

    req.session.user = user;
    return res.status(200).json({
      success: true,
      message: 'Login Successful',
    });
  } catch (err) {
    logging(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      return res.status(200).json({
        message: 'Logout Successful',
      });
    });
  } catch (err) {
    logging(err);
  }
};

// USER
const profile = async (req, res) => {
  try {
    const userID = req.session.user._id;
    const userdb = await users.findById(userID);

    return res.json(userdb);
  } catch (err) {
    logging(err);

    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const changeName = async (req, res) => {
  try {
    const name = req.body;
    const user = await user.findById(req.session.user._id);
    user.name = name;
    await user.save();
    return res.json({
      message: 'Name Changed',
    });
  } catch (err) {
    logging(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const changeBio = async (req, res) => {
  try {
    const bio = req.body;
    const user = await user.findById(req.session.user._id);
    user.bio = bio;
    await user.save();
    return res.json({
      message: 'Bio Changed',
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const deleteAccount = async (req, res) => {
  try {
    const user = await user.findByIdAndDelete(req.session.user._id);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      return res.redirect('/?msg=Delete+Successful');
    });
    return res.json({
      message: 'Name Changed',
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const followUser = async (req, res) => {
  try {
    const userID = req.query.id;
    const user = await users.findById(userID);
    if (!user)
      return res.status(400).json({
        message: 'Invald Request',
      });
    let i = user.followers.indexOf(userID);
    if (i == -1) {
      user.followers.push(req.session.user._id);
      await user.save();
      return res.json({
        message: 'Followed',
      });
    } else {
      user.followers.splice(i, 1);
      await user.save();
      return res.json({
        message: 'Unfollowed',
      });
    }
  } catch (err) {
    logging(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  register,
  login,
  logout,
  profile,
  followUser,
  changeBio,
  deleteAccount,
  verification,
};
