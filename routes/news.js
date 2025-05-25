const express = require('express');
const News = require('../models/news.js');
const router = express.Router();

// Get all news
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single news item
router.get('/:id', async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) return res.status(404).json({ message: 'News not found' });
    res.json(newsItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get breaking news
router.get('/breaking', async (req, res) => {
  try {
    const breakingNews = await News.find({ isBreaking: true }).sort({ createdAt: -1 }).limit(3);
    res.json(breakingNews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;