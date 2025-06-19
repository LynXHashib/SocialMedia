'use strict';
const express = require('express');
const { default: mongoose } = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');

const app = express();
app.use(express.json());
app.use(
  session({
    secret: 'CCS',
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/socialMedia',
      touchAfter: 24 * 3600,
    }),
  })
);

const mongoDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/socialMedia');
    console.log(`Connected Successfully`);
  } catch (err) {
    console.log(err);
  }
};
mongoDB();

// ROUTES

const apiRoute = require('./routes/apiRoutes');

//
app.get('/', async (req, res) => {
  res.json({ message: "It's working perfectly fine" });
});
app.use('/api/user', apiRoute);
module.exports = app;
