require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const newsRouter = require('./routes/news');
const adminRouter = require('./routes/admin');
const cookieParser = require('cookie-parser');

const app = express();
const mainRouter = require('./routes/main');

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use('/admin', adminRouter);
// Routes
app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});



app.use('/api/news', newsRouter);
app.use('/admin', adminRouter);
// Make sure this comes AFTER static files middleware
app.use(express.static(path.join(__dirname, 'public')));

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ppolicy.html'));
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



// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/admin/Logout', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});


app.get('/news/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'news-item.html'));
});
app.use('/', mainRouter);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add these near other require statements

require('dotenv').config();

// Add this after other middleware
app.use(cookieParser());

// Update .env file with JWT secret


// Add this with your other routes
app.get('/admin/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'settings.html'));
});

app.get('/admin/user.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'user.html'));
});

app.get('/admin/Analytics.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/Analytics.html'));
});


app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});
app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

// Add this with your other routes
