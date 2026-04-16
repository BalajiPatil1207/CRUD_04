const User = require("../models/authModel");
const Message = require("../models/messageModel");
const { handle200 } = require("../helper/successHandler");
const { handle500 } = require("../helper/errorHandler");
const { getActiveCount } = require("../services/presenceStore");

/**
 * Get system-wide statistics for the Chat Command Center
 */
const getStats = async (req, res) => {
  try {
    // Count real records from database
    const totalUsers = await User.count();
    const blockedUsers = await User.count({ where: { isBlocked: true } });
    const totalMessages = await Message.count();
    const activeUsers = getActiveCount();

    // Fetch 5 most recent messages for activity feed
    const recentMessages = await Message.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    // Assemble the dashboard data bundle
    const stats = {
      totalUsers,
      blockedUsers,
      activeUsers,
      totalMessages,
      // Calculate uptime
      uptime:
        process.uptime() > 3600
          ? `${(process.uptime() / 3600).toFixed(1)}h`
          : `${Math.floor(process.uptime() / 60)}m`,

      // Transform messages into activity feed items
      recentActivity: recentMessages.map((m) => ({
        id: m.message_id,
        type: "MESSAGE_SENT",
        title: "Message Dispatched",
        message: `A secure message was exchanged in the system.`,
        timestamp: m.createdAt,
        icon: "message-square",
        color: "text-brand-500",
        bg: "bg-brand-50 dark:bg-brand-900/20",
      })),
    };

    // Add a mock activity for "System Init" if feed is empty
    if (stats.recentActivity.length === 0) {
      stats.recentActivity.push({
        id: "init-1",
        type: "SYSTEM",
        title: "Command Center Online",
        message: "Socket.io engine initialized and secure bridge established.",
        timestamp: new Date(),
        icon: "shield-check",
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
      });
    }

    return handle200(res, stats, "Chat Dashboard stats generated successfully");
  } catch (error) {
    console.error("Stats API Error:", error);
    return handle500(res, error);
  }
};

module.exports = { getStats };
