const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Message Schema
const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false }
});

const Message = mongoose.model('Message', messageSchema);

// Store connected users
const connectedUsers = new Set();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user login
  socket.on('user_login', (username) => {
    socket.username = username;
    connectedUsers.add(username);
    io.emit('user_joined', username);
    io.emit('online_users', Array.from(connectedUsers));
    console.log(`${username} joined the chat`);
  });

  // Handle delete message
  socket.on('delete_message', async (data) => {
    try {
      const msg = await Message.findById(data.messageId);
      if (msg && msg.username === data.username) {
        msg.deleted = true;
        await msg.save();
        io.emit('message_deleted', { messageId: msg._id });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  });

  // Handle new message
  socket.on('send_message', async (data) => {
    try {
      const newMessage = new Message({
        username: data.username,
        message: data.message
      });
      await newMessage.save();
      io.emit('new_message', {
        _id: newMessage._id,
        username: data.username,
        message: data.message,
        timestamp: newMessage.timestamp,
        deleted: false
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle typing indicator
  socket.on('typing', (username) => {
    socket.broadcast.emit('user_typing', username);
  });

  socket.on('stop_typing', (username) => {
    socket.broadcast.emit('user_stop_typing', username);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.username) {
      connectedUsers.delete(socket.username);
      io.emit('user_left', socket.username);
      io.emit('online_users', Array.from(connectedUsers));
      console.log(`${socket.username} left the chat`);
    }
    console.log('User disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

app.get('/api/online-users', (req, res) => {
  res.json(Array.from(connectedUsers));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});