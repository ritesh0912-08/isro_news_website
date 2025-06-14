const express = require('express');
const News = require('../models/News.js');
const router = express.Router();

// Get all news
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    console.error('Error fetching all news:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get breaking news
router.get('/breaking', async (req, res) => {
    try {
        const breakingNews = await News.find({ isBreaking: true, isLive: true })
            .sort({ createdAt: -1 })
            .limit(5);
            
        if (!breakingNews || breakingNews.length === 0) {
            return res.json([]);
        }
        
        res.json(breakingNews);
    } catch (error) {
        console.error('Error fetching breaking news:', error);
        res.status(500).json({ error: 'Error fetching breaking news' });
    }
});

// Get single news item
router.get('/:id', async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) return res.status(404).json({ message: 'News not found' });
    res.json(newsItem);
  } catch (err) {
    console.error('Error fetching single news:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;