const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @route GET /api/chat/users
 * @desc Get all users except self
 */
router.get('/users', authenticateToken, chatController.getUsers);

/**
 * @route GET /api/chat/messages/:receiverId
 * @desc Get message history with a user
 */
router.get('/messages/:receiverId', authenticateToken, chatController.getMessages);

module.exports = router;
