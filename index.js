'use strict';
const express = require('express');
const { default: mongoose } = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const dotenv = require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
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
const home = require('./controllers/home');

//
app.use('/api/', apiRoute);
module.exports = app;
