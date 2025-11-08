'use strict';
import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import path from 'path';
import { createServer } from 'http';

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { Server } from 'socket.io';
dotenv.config()
const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: [
      'http://localhost:5001',
      'http://127.0.0.1:5001',
      process.env.CORS_URL!,
      'https://lynxhashib.github.io/SocialMedia',
      'https://lynxhashib.github.io',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

//Schema
import { messageSchema } from './database/models';

// const messages = mongoose.model('messages', messageSchema);
// app.use(
//   cors({
//     origin: [
//       'http://localhost:5001',
//       'http://127.0.0.1:5001',
//       process.env.CORS_URL!,
//       'https://lynxhashib.github.io/SocialMedia',
//       'https://lynxhashib.github.io',
//     ],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );
app.all("/api/auth/{*access}", toNodeHandler(auth));
app.use(express.json());
app.set('trust proxy', 1);


/* // IO
import { getOrCreateConversation } from './controllers/messenger';

io.on('connection', (socket: any) => {
  console.log('User connected:', socket.id);

  socket.on('register-user', (userId: any) => {
    console.log('User registered:', userId);
    socket.join(userId.toString());
    socket.userId = userId; // Store userId on socket for reference
  });

  socket.on('private-message', async (data: any) => {
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

  socket.on('error', (error: string) => {
    console.error('Socket error:', error);
  });
);
*/

// AUTENTICATION 
// ROUTES

import apiRoute from './routes/apiRoutes';
import authRoute from './routes/authRoute';
import { authCheck } from './middlewares/app';
import home from './controllers/home';

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
export { app, http, io };
