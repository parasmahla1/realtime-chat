import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI as string;

mongoose.connect(MONGODB_URI, {
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  retryWrites: true,
  w: 'majority',
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
// Message Schema 
const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

// Online Users Map
interface OnlineUser {
  username: string;
  socketId: string;
}

const onlineUsers = new Map<string, OnlineUser>();

// Socket.io Connection Handling
io.on('connection', (socket: Socket) => {
  console.log('User connected:', socket.id);

  // User joins
  socket.on('user:join', (username: string) => {
    onlineUsers.set(socket.id, { username, socketId: socket.id });
    
    // Broadcast updated online users list
    const usersList = Array.from(onlineUsers.values());
    io.emit('users:online', usersList);
    
    console.log(`${username} joined. Online users:`, usersList.length);
  });

  // Handle new message
  socket.on('message:send', async (data: { sender: string; receiver: string; content: string }) => {
    try {
      // Save message to MongoDB
      const message = new Message({
        sender: data.sender,
        receiver: data.receiver,
        content: data.content,
        timestamp: new Date(),
      });
      
      const savedMessage = await message.save();

      // Find receiver's socket
      const receiverSocket = Array.from(onlineUsers.entries()).find(
        ([_, user]) => user.username === data.receiver
      );

      // Send to receiver if online
      if (receiverSocket) {
        io.to(receiverSocket[0]).emit('message:receive', savedMessage);
      }

      // Send confirmation back to sender
      socket.emit('message:sent', savedMessage);
      
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('message:error', { error: 'Failed to send message' });
    }
  });

  // Handle typing indicator
  socket.on('typing:start', (data: { sender: string; receiver: string }) => {
    const receiverSocket = Array.from(onlineUsers.entries()).find(
      ([_, user]) => user.username === data.receiver
    );
    
    if (receiverSocket) {
      io.to(receiverSocket[0]).emit('typing:update', {
        sender: data.sender,
        isTyping: true,
      });
    }
  });

  socket.on('typing:stop', (data: { sender: string; receiver: string }) => {
    const receiverSocket = Array.from(onlineUsers.entries()).find(
      ([_, user]) => user.username === data.receiver
    );
    
    if (receiverSocket) {
      io.to(receiverSocket[0]).emit('typing:update', {
        sender: data.sender,
        isTyping: false,
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      console.log(`${user.username} disconnected`);
      onlineUsers.delete(socket.id);
      
      // Broadcast updated online users list
      const usersList = Array.from(onlineUsers.values());
      io.emit('users:online', usersList);
    }
  });
});

const PORT = 3001;

httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});