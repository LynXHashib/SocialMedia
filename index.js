'use strict';
const express = require('express');
const { default: mongoose } = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const dotenv = require('dotenv').config();
const app = express();
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      touchAfter: 24 * 3600,
    }),
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

//
app.get('/', async (req, res) => {
  res.json({ message: "It's working perfectly fine" });
});
app.use('/api/user', apiRoute);
module.exports = app;
