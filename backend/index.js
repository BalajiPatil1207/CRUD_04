require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectSQLite } = require('./src/config/sqliteDB');

const authRouter = require('./src/routers/authRouter');
const chatRouter = require('./src/routers/chatRouter');
const statsRouter = require('./src/routers/statsRouter');
const Message = require('./src/models/messageModel');

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Chat System server is running.');
});

// Authentication & Chat Routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/stats', statsRouter);

// Socket.io Implementation
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('send_message', async (data) => {
    const { senderId, receiverId, message, room } = data;
    
    try {
      const newMessage = await Message.create({
        senderId,
        receiverId,
        message
      });
      // Broadcast specifically to the room
      io.to(room).emit('receive_message', newMessage);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start Server and Sync Database
const startServer = async () => {
    try {
        await connectSQLite();
        
        server.listen(port, () => {
            console.log(`Server listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
    }
};

startServer();
