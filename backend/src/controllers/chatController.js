const User = require('../models/authModel');
const Message = require('../models/messageModel');
const { handle200 } = require('../helper/successHandler');
const { handle500 } = require('../helper/errorHandler');
const { Op } = require('sequelize');

/**
 * Get all users excluding the current logged-in user
 */
const getUsers = async (req, res) => {
    try {
        const currentUserId = req.user.user_id; // Using req.user from authMiddleware

        const users = await User.findAll({
            where: {
                user_id: {
                    [Op.ne]: currentUserId
                }
            },
            attributes: ['user_id', 'username', 'email', 'role']
        });

        return handle200(res, users, "Users fetched successfully");
    } catch (error) {
        return handle500(res, error);
    }
};

/**
 * Get message history between current user and another user
 */
const getMessages = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user.user_id;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });

        return handle200(res, messages, "Messages fetched successfully");
    } catch (error) {
        return handle500(res, error);
    }
};

module.exports = {
    getUsers,
    getMessages
};
