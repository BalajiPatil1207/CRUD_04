// middleware/authMiddleware.js
const User = require('../models/authModel');
const { verifyToken } = require('../helper/authHelper');
const { handle401 } = require('../helper/errorHandler');

/**
 * Authentication Middleware
 * Checks for JWT token in Authorization header
 */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return handle401(res, "No token provided, access denied");
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return handle401(res, "Invalid or expired token");
  }

  try {
    const currentUser = await User.findByPk(decoded.user_id, {
      attributes: ['user_id', 'username', 'email', 'role', 'isBlocked']
    });

    if (!currentUser) {
      return handle401(res, "User session is no longer valid");
    }

    if (currentUser.isBlocked) {
      return res.status(403).json({
        status: false,
        errors: {
          auth: "Your account is blocked by the admin"
        }
      });
    }

    // Attach user data to request object
    req.user = currentUser.toJSON();
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      errors: {
        server: error.message || "Authentication failed"
      }
    });
  }
};

module.exports = {
  authenticateToken,
};
