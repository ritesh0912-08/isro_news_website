const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

// Make sure your auth middleware is properly checking tokens
const auth = async (req, res, next) => {
    try {
        console.log('Auth middleware - Cookies:', req.cookies);
        const token = req.cookies.token;
        
        if (!token) {
            console.log('No token found in cookies');
            // For API requests, return JSON response
            if (req.path.startsWith('/api/')) {
                return res.status(401).json({ message: 'Not authenticated' });
            }
            // For web requests, redirect to login
            return res.redirect('/admin/login');
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', decoded);
        
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log('User not found for ID:', decoded.id);
            // For API requests, return JSON response
            if (req.path.startsWith('/api/')) {
                return res.status(401).json({ message: 'User not found' });
            }
            // For web requests, redirect to login
            return res.redirect('/admin/login');
        }
        
        console.log('User authenticated:', user.username);
        req.user = user;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        // For API requests, return JSON response
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        // For web requests, redirect to login
        return res.redirect('/admin/login');
    }
};

const adminOnly = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        console.log('Admin access denied for user:', req.user?.username);
        // For API requests, return JSON response
        if (req.path.startsWith('/api/')) {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }
        // For web requests, redirect to login
        return res.redirect('/admin/login');
    }
    console.log('Admin access granted for:', req.user.username);
    next();
};

module.exports = { auth, adminOnly };