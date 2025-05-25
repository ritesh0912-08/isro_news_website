import express from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import News from '../models/news.js';
import User from '../models/User.js';
import Contact from '../models/contact.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(cookieParser());
router.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

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
        }).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
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


// In your admin.js routes
router.get('/messages', auth, adminOnly, async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.render('messages', { messages }); // Or res.json(messages)
});

// Settings route
router.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'settings.html'));
});

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/admin/login');
});

// Serve login page
router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './views' });
});

// Protect all admin routes
router.use(auth);
router.use(adminOnly);

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

// Serve admin dashboard
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

export default router;