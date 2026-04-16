const User = require('../models/authModel');
const Message = require('../models/messageModel');
const { handle200 } = require('../helper/successHandler');
const { handle500 } = require('../helper/errorHandler');
const { Op } = require('sequelize');
const { isUserOnline } = require('../services/presenceStore');

/**
 * Get all users excluding the current logged-in user
 */
const getUsers = async (req, res) => {
    try {
        const currentUserId = req.user.user_id; // Using req.user from authMiddleware
        const isAdmin = req.user.role === 'admin';

        const where = isAdmin
            ? { user_id: { [Op.ne]: currentUserId } }
            : {
                user_id: {
                    [Op.ne]: currentUserId
                },
                isBlocked: false
            };

        const users = await User.findAll({
            where,
            attributes: ['user_id', 'username', 'email', 'role', 'isBlocked']
        });

        const enrichedUsers = await Promise.all(users.map(async (user) => {
            const data = user.toJSON();
            const lastMessage = await Message.findOne({
                where: {
                    [Op.or]: [
                        { senderId: currentUserId, receiverId: data.user_id },
                        { senderId: data.user_id, receiverId: currentUserId }
                    ]
                },
                order: [['createdAt', 'DESC']]
            });

            const unreadCount = await Message.count({
                where: {
                    senderId: data.user_id,
                    receiverId: currentUserId,
                    isSeen: false
                }
            });

            return {
                ...data,
                isOnline: isUserOnline(data.user_id),
                unreadCount,
                lastMessage: lastMessage ? lastMessage.message : "",
                lastMessageAt: lastMessage ? lastMessage.createdAt : null,
                lastMessageSenderId: lastMessage ? lastMessage.senderId : null
            };
        }));

        return handle200(res, enrichedUsers, "Users fetched successfully");
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
        const isAdmin = req.user.role === 'admin';

        const receiver = await User.findByPk(receiverId, {
            attributes: ['user_id', 'isBlocked', 'role']
        });

        if (!receiver) {
            return res.status(404).json({
                status: false,
                errors: { receiverId: "Selected user was not found" }
            });
        }

        if (!isAdmin && receiver.isBlocked) {
            return res.status(403).json({
                status: false,
                errors: { auth: "This user is blocked and cannot chat right now" }
            });
        }

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });

        // Mark incoming messages as seen
        await Message.update(
            { isSeen: true },
            {
                where: {
                    senderId: receiverId,
                    receiverId: senderId,
                    isSeen: false
                }
            }
        );

        return handle200(res, messages, "Messages fetched successfully");
    } catch (error) {
        return handle500(res, error);
    }
};

const toggleBlockUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: false,
                errors: { auth: "Only admin can block or unblock users" }
            });
        }

        const { userId } = req.params;
        const { isBlocked } = req.body;

        if (String(req.user.user_id) === String(userId)) {
            return res.status(400).json({
                status: false,
                errors: { userId: "You cannot block your own account" }
            });
        }

        const targetUser = await User.findByPk(userId);

        if (!targetUser) {
            return res.status(404).json({
                status: false,
                errors: { userId: "User not found" }
            });
        }

        targetUser.isBlocked = Boolean(isBlocked);
        await targetUser.save();

        return handle200(res, {
            user_id: targetUser.user_id,
            isBlocked: targetUser.isBlocked
        }, targetUser.isBlocked ? "User blocked successfully" : "User unblocked successfully");
    } catch (error) {
        return handle500(res, error);
    }
};

const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { message } = req.body;
        const currentUserId = req.user.user_id;

        if (!message || !message.trim()) {
            return res.status(400).json({
                status: false,
                errors: { message: "Message cannot be empty" }
            });
        }

        const targetMessage = await Message.findByPk(messageId);

        if (!targetMessage) {
            return res.status(404).json({
                status: false,
                errors: { messageId: "Message not found" }
            });
        }

        if (req.user.role !== 'admin' && Number(targetMessage.senderId) !== Number(currentUserId)) {
            return res.status(403).json({
                status: false,
                errors: { auth: "You can only edit your own messages" }
            });
        }

        targetMessage.message = message.trim();
        targetMessage.editedAt = new Date();
        await targetMessage.save();

        return handle200(res, targetMessage, "Message updated successfully");
    } catch (error) {
        return handle500(res, error);
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const currentUserId = req.user.user_id;

        const targetMessage = await Message.findByPk(messageId);

        if (!targetMessage) {
            return res.status(404).json({
                status: false,
                errors: { messageId: "Message not found" }
            });
        }

        if (req.user.role !== 'admin' && Number(targetMessage.senderId) !== Number(currentUserId)) {
            return res.status(403).json({
                status: false,
                errors: { auth: "You can only delete your own messages" }
            });
        }

        await targetMessage.destroy();

        return handle200(res, { messageId: Number(messageId) }, "Message deleted successfully");
    } catch (error) {
        return handle500(res, error);
    }
};

module.exports = {
    getUsers,
    getMessages,
    toggleBlockUser,
    updateMessage,
    deleteMessage
};
