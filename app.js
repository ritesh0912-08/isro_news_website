require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const newsRouter = require('./routes/news.js');
const adminRouter = require('./routes/admin.js');
const mainRouter = require('./routes/main.js');
const contactRouter = require('./routes/contact.js');
const { auth, adminOnly } = require('./middleware/auth.js');
// const messagesRouter = require('./routes/messages'); // Uncomment and fix if needed

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'http://your-frontend-domain.com' 
        : 'http://localhost:3000',
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
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "*"]  // Allow images from any source
      }
    }
  })
);
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/news', newsRouter);
app.use('/api/contact', contactRouter);
app.use('/admin', adminRouter);
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

