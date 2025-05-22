const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser');
const News = require('../models/news');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

router.use(cookieParser());

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '8h'
        });
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        }).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Settings route
router.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'settings.html'));
});


// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/admin/login');
});
// Add this after creating the router
router.use(cookieParser());

// Update your login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '8h'
        });
        
        // Set cookie with proper options
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS in production
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        }).json({ message: 'Login successful' });
        
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update your auth middleware check
router.get('/', (req, res) => {
    // Check for token first
    if (!req.cookies.token) {
        return res.redirect('/admin/login');
    }
    
    // Verify token
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/admin/login');
        }
        // Token is valid - serve admin page
        res.sendFile('admin.html', { root: './views' });
    });
});
// Serve login page
router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './views' });
});

// Protect all admin routes
router.use(auth);
router.use(adminOnly);

// Serve admin dashboard (protected)
router.get('/', (req, res) => {
    res.sendFile('admin.html', { root: './views' });
});

// ... rest of your existing admin routes ...

// Serve admin page
router.get('/', (req, res) => {
  res.sendFile('admin.html', { root: './views' });
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

// Delete news
router.delete('/:id', async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) return res.status(404).json({ message: 'News not found' });
    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;