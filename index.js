'use strict';
const express = require('express');
const { default: mongoose } = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
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
  },
});

//Schema
const { messageSchema } = require('./database/models');

const messages = mongoose.model('messages', messageSchema);
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
      secure: process.env.NODE_ENV === 'PRODUCTION',
      sameSite: process.env.NODE_ENV === 'PRODUCTION' ? 'none' : 'lax',
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

// IO
const { getOrCreateConversation } = require('./controllers/messenger');

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register-user', (userId) => {
    console.log('User registered:', userId);
    socket.join(userId.toString());
    socket.userId = userId; // Store userId on socket for reference
  });

  socket.on('private-message', async (data) => {
    try {
      const { toUserId, fromUserId, message } = data;

      // Debug logging
      console.log('Private message received:', {
        toUserId,
        fromUserId,
        message,
      });

      // Validate required fields
      if (!toUserId || !fromUserId || !message) {
        console.error('Missing required fields:', {
          toUserId,
          fromUserId,
          message,
        });
        socket.emit('error', { message: 'Missing required fields' });
        return;
      }

      // Get or create conversation
      const convo = await getOrCreateConversation(fromUserId, toUserId);
      console.log('Conversation ID:', convo._id);

      // Create message
      const msg = await messages.create({
        conversationId: convo._id,
        sender: fromUserId,
        recipient: toUserId,
        text: message,
        sentAt: new Date(),
        read: false,
      });

      // Update conversation's lastMessage and updatedAt
      convo.lastMessage = msg._id;
      convo.updatedAt = new Date();
      await convo.save();

      // Populate sender info for the response
      await msg.populate('sender', 'username profilePicture');

      console.log('Message created:', msg._id);

      // Emit to recipient and sender
      io.to(toUserId.toString()).emit('private-message', {
        ...msg.toObject(),
        conversationId: convo._id,
      });
      io.to(fromUserId.toString()).emit('private-message', {
        ...msg.toObject(),
        conversationId: convo._id,
      });
    } catch (error) {
      console.error('Socket.IO private-message error:', error);
      socket.emit('error', {
        message: 'Failed to send message',
        error: error.message,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// ROUTES

const apiRoute = require('./routes/apiRoutes');
const authRoute = require('./routes/authRoute');
const { authCheck } = require('./middlewares/app');
const home = require('./controllers/home');

//SWAGGER
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//

app.get('/', home);
app.use('/auth', authRoute);
app.use('/api', authCheck, apiRoute);
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'URL DO NOT EXIST' });
});
module.exports = { app, http, io };
