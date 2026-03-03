const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect middleware — verifies the Bearer JWT from the Authorization header
 * and attaches the authenticated user object to `req.user`.
 *
 * Usage: router.get('/protected', protect, handler);
 */
const protect = async (req, res, next) => {
    let token;

    // Extract token from "Bearer <token>" header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized — no token provided',
        });
    }

    try {
        // Verify token and decode payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user (without password) to request
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized — user not found',
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized — invalid token',
        });
    }
};

module.exports = { protect };
