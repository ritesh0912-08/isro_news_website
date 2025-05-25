require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    createAdminUser();
  })
  .catch(err => console.error('MongoDB connection error:', err));

async function createAdminUser() {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (!adminExists) {
      const admin = new User({
        username: 'ritesh',
        password: 'nick0912', // Change this in production!
        role: 'admin'
      });
      
      await admin.save();
      console.log('Admin user created:', admin);
    } else {
      console.log('Admin user already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

// Add this to your Express app setup
app.use((req, res, next) => {
  res.setHeader(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'"
  );
  next();
});