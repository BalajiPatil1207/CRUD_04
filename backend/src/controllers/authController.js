const User = require('../models/authModel');
const { hashPassword, comparePassword, generateToken } = require('../helper/authHelper');
const { handle200, handle201 } = require('../helper/successHandler');
const { formatSequelizeError, handle401, handle500 } = require('../helper/errorHandler');
const { Op } = require('sequelize');

/**
 * User Registration
 */
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
             return res.status(400).json({ status: false, errors: { body: "Username, email and password are required" } });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create the user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Convert to JSON and remove password from response
        const userData = newUser.toJSON();
        delete userData.password;

        return handle201(res, userData, "User registered successfully");
    } catch (error) {
        return formatSequelizeError(res, error);
    }
};

/**
 * User Login
 */
const login = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be username or email

        if (!identifier || !password) {
            return res.status(400).json({ status: false, errors: { body: "Email/Username and password are required" } });
        }

        // Find user by username or email
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: identifier },
                    { email: identifier }
                ]
            }
        });

        if (!user) {
            return handle401(res, "Invalid email/username or password");
        }

        // Check password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return handle401(res, "Invalid email/username or password");
        }

        // Generate Token
        const token = generateToken({ user_id: user.user_id, username: user.username, email: user.email });

        // Exclude password from the user object
        const userData = user.toJSON();
        delete userData.password;

        return handle200(res, { token, user: userData }, "Login successful");
    } catch (error) {
        return handle500(res, error);
    }
};

module.exports = {
    register,
    login
};
