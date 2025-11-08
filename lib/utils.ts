import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
const dotenv = require('dotenv').config();
const logging = (err: any) => {
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
const prisma = new PrismaClient()
export { logging, transporter, prisma };
