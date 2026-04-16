const User = require("../models/authModel");
const Product = require("../models/productModel");
const { handle200 } = require("../helper/successHandler");
const { handle500 } = require("../helper/errorHandler");

/**
 * Get system-wide statistics and recent activity
 */
const getStats = async (req, res) => {
  try {
    // Count real records from database
    const totalTeachers = await User.count();
    const totalProducts = await Product.count();

    // Fetch 5 most recent products for activity feed
    const recentProducts = await Product.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    // Assemble the dashboard data bundle
    const stats = {
      totalTeachers,
      totalProducts,
      // Calculate uptime using process uptime
      uptime:
        process.uptime() > 3600
          ? `${(process.uptime() / 3600).toFixed(1)}h`
          : `${Math.floor(process.uptime() / 60)}m`,

      // Transform products into activity feed items
      recentActivity: recentProducts.map((p) => ({
        id: p.p_id,
        type: "PRODUCT_ADDED",
        title: "New Product Added",
        message: `Product "${p.name}" was successfully listed.`,
        timestamp: p.createdAt,
        icon: "package",
        color: "text-brand-500",
        bg: "bg-brand-50 dark:bg-brand-900/20",
      })),
    };

    // Add a mock activity for "System Init" if feed is empty
    if (stats.recentActivity.length === 0) {
      stats.recentActivity.push({
        id: "init-1",
        type: "SYSTEM",
        title: "System Initialized",
        message: "Database connection established and sync complete.",
        timestamp: new Date(),
        icon: "shield-check",
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
      });
    }

    return handle200(res, stats, "Dashboard stats generated successfully");
  } catch (error) {
    console.error("Stats API Error:", error);
    return handle500(res, error);
  }
};

module.exports = { getStats };
