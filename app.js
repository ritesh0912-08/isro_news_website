require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const newsRouter = require('./routes/news');
const adminRouter = require('./routes/admin');
const mainRouter = require('./routes/main');

const app = express();
// In app.js
const cors = require('cors');
app.use(cors({
  origin: 'http://your-frontend-domain.com',
  credentials: true
}));
// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
// Replace both helmet() calls with this single configuration:
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": [
          "'self'",
          "data:",
          "https://encrypted-tbn0.gstatic.com",
          "https://etvbharatimages.akamaized.net",
          "https://www.google.com",
          "https://*.google.com",
          "https://*.googleusercontent.com",
          "https://*.gstatic.com",
          "https://*.facebook.com"
        ]
      }
    }
  })
);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/admin', adminRouter);

// Routes
app.use('/admin', adminRouter);
app.use('/admin', (req, res, next) => {
  console.log(`Incoming ${req.method} request for: ${req.originalUrl}`);
  next();
});
app.use('/api/news', newsRouter);
app.use('/', mainRouter);

// HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.get('/careers.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'careers.html'));
});

app.get('/mission.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'mission.html'));
});

app.get('/launches.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'launches.html'));
});

app.get('/research.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'research.html'));
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ppolicy.html'));
});

app.get('/news/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'news-item.html'));
});

// Admin routes
app.get('/admin/Logout', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/admin/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'settings.html'));
});

app.get('/admin/user.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'user.html'));
});

app.get('/admin/Analytics.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Analytics.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

