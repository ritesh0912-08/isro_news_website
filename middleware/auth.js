const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).send('Invalid token.');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Access denied. Admin privileges required.');
  }
  next();
};

module.exports = { auth, adminOnly };