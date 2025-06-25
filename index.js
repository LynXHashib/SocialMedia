'use strict';
const express = require('express');
const { default: mongoose } = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:5001',
      'http://127.0.0.1:5001',
      process.env.CORS_URL,
      'https://lynxhashib.github.io/SocialMedia',
      'https://lynxhashib.github.io',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.set('trust proxy', 1);
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: false,
      // sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const mongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected Successfully`);
  } catch (err) {
    console.log(err);
  }
};
mongoDB();

// ROUTES

const apiRoute = require('./routes/apiRoutes');
const authRoute = require('./routes/authRoute');
const { authCheck } = require('./middlewares/app');
const home = require('./controllers/home');

//

app.get('/', home);

app.use('/auth', authRoute);
app.use('/api', authCheck, apiRoute);
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'URL DO NOT EXIST' });
});
module.exports = app;
