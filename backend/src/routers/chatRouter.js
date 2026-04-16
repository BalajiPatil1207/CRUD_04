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

/**
 * @route PATCH /api/chat/messages/:messageId
 * @desc Edit a message
 */
router.patch('/messages/:messageId', authenticateToken, chatController.updateMessage);

/**
 * @route DELETE /api/chat/messages/:messageId
 * @desc Delete a message
 */
router.delete('/messages/:messageId', authenticateToken, chatController.deleteMessage);

/**
 * @route PATCH /api/chat/users/:userId/block
 * @desc Block or unblock a user
 */
router.patch('/users/:userId/block', authenticateToken, chatController.toggleBlockUser);

module.exports = router;
