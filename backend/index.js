require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectSQLite } = require('./src/config/sqliteDB');

const authRouter = require('./src/routers/authRouter');
const chatRouter = require('./src/routers/chatRouter');
const statsRouter = require('./src/routers/statsRouter');
const User = require('./src/models/authModel');
const Message = require('./src/models/messageModel');
const { verifyToken } = require('./src/helper/authHelper');
const {
  registerSocket,
  unregisterSocket,
} = require('./src/services/presenceStore');

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
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error("Invalid or expired token"));
    }

    const user = await User.findByPk(decoded.user_id, {
      attributes: ['user_id', 'username', 'email', 'role', 'isBlocked']
    });

    if (!user) {
      return next(new Error("User session is invalid"));
    }

    if (user.isBlocked) {
      return next(new Error("Your account is blocked"));
    }

    socket.data.user = user.toJSON();
    next();
  } catch (error) {
    next(error);
  }
});

io.on('connection', (socket) => {
  const currentUser = socket.data.user;
  registerSocket(currentUser.user_id, socket.id);
  socket.join(`user_${currentUser.user_id}`);
  io.emit('presence_update', {
    userId: currentUser.user_id,
    isOnline: true
  });

  console.log('A user connected:', socket.id, 'user:', currentUser.user_id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('send_message', async (data) => {
    const { senderId, receiverId, message, room } = data;

    if (Number(senderId) !== Number(currentUser.user_id)) {
      socket.emit('message_error', { message: 'Sender mismatch' });
      return;
    }

    try {
      const [sender, receiver] = await Promise.all([
        User.findByPk(senderId, { attributes: ['user_id', 'isBlocked', 'role'] }),
        User.findByPk(receiverId, { attributes: ['user_id', 'isBlocked', 'role'] }),
      ]);

      if (!sender || !receiver) {
        socket.emit('message_error', { message: 'User not found' });
        return;
      }

      if (sender.isBlocked || receiver.isBlocked) {
        socket.emit('message_error', { message: 'Chat is disabled for blocked users' });
        return;
      }

      const newMessage = await Message.create({
        senderId,
        receiverId,
        message
      });
      io.to(`user_${senderId}`).emit('receive_message', newMessage);
      io.to(`user_${receiverId}`).emit('receive_message', newMessage);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on('edit_message', async (data) => {
    const { messageId, message } = data;

    try {
      const targetMessage = await Message.findByPk(messageId);
      if (!targetMessage) {
        socket.emit('message_error', { message: 'Message not found' });
        return;
      }

      if (Number(targetMessage.senderId) !== Number(currentUser.user_id) && currentUser.role !== 'admin') {
        socket.emit('message_error', { message: 'You can only edit your own messages' });
        return;
      }

      targetMessage.message = message;
      targetMessage.editedAt = new Date();
      await targetMessage.save();

      io.to(`user_${targetMessage.senderId}`).emit('message_updated', targetMessage);
      io.to(`user_${targetMessage.receiverId}`).emit('message_updated', targetMessage);
    } catch (err) {
      console.error("Error updating message:", err);
    }
  });

  socket.on('delete_message', async (data) => {
    const { messageId } = data;

    try {
      const targetMessage = await Message.findByPk(messageId);
      if (!targetMessage) {
        socket.emit('message_error', { message: 'Message not found' });
        return;
      }

      if (Number(targetMessage.senderId) !== Number(currentUser.user_id) && currentUser.role !== 'admin') {
        socket.emit('message_error', { message: 'You can only delete your own messages' });
        return;
      }

      const senderId = targetMessage.senderId;
      const receiverId = targetMessage.receiverId;
      await targetMessage.destroy();

      io.to(`user_${senderId}`).emit('message_deleted', { messageId: Number(messageId) });
      io.to(`user_${receiverId}`).emit('message_deleted', { messageId: Number(messageId) });
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  });

  socket.on('typing', (data) => {
    socket.to(data.room).emit('typing', data);
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.room).emit('stop_typing', data);
  });

  socket.on('disconnect', () => {
    unregisterSocket(socket.id);
    io.emit('presence_update', {
      userId: currentUser.user_id,
      isOnline: false
    });
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
