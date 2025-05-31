const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const mongoose = require('mongoose');
const News = require('../models/news.js');
const User = require('../models/User.js');
const Contact = require('../models/contact.js');
const { auth, adminOnly } = require('../middleware/auth.js');

const router = express.Router();

router.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// Serve login page - this should be before auth middleware
router.get('/login', (req, res) => {
    // If user is already logged in, redirect to admin dashboard
    if (req.cookies.token) {
        return res.redirect('/admin');
    }
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

// Login route
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt:', req.body);
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        console.log('Login successful for user:', username);
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '8h'
        });
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        }).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/admin/login');
});

// Protect all admin routes
router.use(auth);
router.use(adminOnly);

// Admin dashboard
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'admin.html'));
});

router.get('/messages', auth, adminOnly, async (req, res) => {
  try {
      const messages = await Contact.find().sort({ createdAt: -1 });
      res.sendFile(path.join(__dirname, '../views/messages.html'));
  } catch (error) {
      res.status(500).json({ error: 'Server error' });
  }
});

router.get('/api/messages', auth, adminOnly, async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json(messages);
});

// Settings route
router.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'settings.html'));
});

// Delete news endpoint
router.delete('/news/:id', async (req, res) => {
    console.log(`DELETE request received for news ID: ${req.params.id}`);
    
    try {
        // Validate ID format
        if (!mongoose.isValidObjectId(req.params.id)) {
            console.log('Invalid ID format received');
            return res.status(400).json({ 
                success: false,
                message: 'Invalid news ID format'
            });
        }

        // Delete from database
        const result = await News.findByIdAndDelete(req.params.id);
        
        if (!result) {
            console.log('News item not found in database');
            return res.status(404).json({ 
                success: false,
                message: 'News item not found'
            });
        }

        console.log('News deleted successfully');
        return res.json({ 
            success: true,
            message: 'News deleted successfully'
        });

    } catch (error) {
        console.error('Delete operation failed:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during deletion',
            error: error.message
        });
    }
});

// Add new news
router.post('/add', async (req, res) => {
    const { title, content, imageUrl, category, isBreaking } = req.body;
    
    try {
        const newsItem = new News({
            title,
            content,
            imageUrl: imageUrl || '',
            category,
            isBreaking: isBreaking === 'on'
        });

        await newsItem.save();
        res.status(201).json({ message: 'News added successfully', newsItem });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update news
router.put('/:id', async (req, res) => {
    try {
        const updatedNews = await News.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content,
                imageUrl: req.body.imageUrl,
                category: req.body.category,
                isBreaking: req.body.isBreaking === 'on',
                updatedAt: Date.now()
            },
            { new: true }
        );
        
        if (!updatedNews) return res.status(404).json({ message: 'News not found' });
        res.json({ message: 'News updated successfully', updatedNews });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;