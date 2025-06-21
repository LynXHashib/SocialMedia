const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const logging = (err) => {
  fs.appendFileSync(
    path.join(__dirname, '..', 'log', 'logs.txt'),
    `${new Date().toISOString()} ${err.stack || err}\n\n`
  );
};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = { logging, transporter };
