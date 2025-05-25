const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

// Make sure your auth middleware is properly checking tokens
const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        User.findById(decoded.id)
            .then(user => {
                if (!user) {
                    return res.status(401).json({ message: 'User not found' });
                }
                req.user = user;
                next();
            })
            .catch(err => {
                res.status(401).json({ message: 'Not authenticated' });
            });
    } catch (err) {
        res.status(401).json({ message: 'Not authenticated' });
    }
};

const adminOnly = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
};

module.exports = { auth, adminOnly };