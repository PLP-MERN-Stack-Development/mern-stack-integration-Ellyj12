
// Imported Modules

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const errorHandler = require('./middlewear/errorHandler')

// Environment Configuration

dotenv.config({ path: path.join(__dirname, 'config', '.env') });


// Initialize Express App

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(express.json());
app.use(cors());

// Log requests in development mode
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const accessTime = new Date().toLocaleString();
    console.log(`[${accessTime}] ${req.method} ${req.url}`);
    next();
  });
}


// Route Imports

const postsRoutes = require('./routes/Post');

// Use routes
app.use('/api/posts', postsRoutes);
app.use(errorHandler);

// Base Route
app.get('/', (req, res) => {
  res.send('📰 MERN Blog API is running');
});


// Database Connection

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`⚡ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
