// In routes/main.js
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'about.html'));
});

// In routes/main.js
router.get('/ppolicy.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'ppolicy.html'));
});
module.exports = router;