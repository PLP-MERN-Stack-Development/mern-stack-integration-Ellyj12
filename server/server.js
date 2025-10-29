// Imported Modules 

const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const dotenv    = require('dotenv');
const path      = require('path');

// Environment Variables 
dotenv.config();



// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const AccessTime = new Date().toLocaleString();
    console.log(`${req.method} ${req.url} ${AccessTime}`);

    next();
  });
}

app.get('/', (req, res) => {
  res.send('MERN Blog API is running');
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

  if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}