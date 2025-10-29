// seed.js - Populate database with test posts
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Post = require('./models/PostTemplate'); // adjust if path differs

// --- 1️⃣ Load environment variables ---
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

// --- 2️⃣ Connect to MongoDB ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ Mongo connection error:', err));

// --- 3️⃣ Test Data ---
const posts = [
  {
    title: 'Exploring the MERN Stack',
    content:
      'The MERN stack combines MongoDB, Express, React, and Node.js for full-stack web development.',
    featuredImage: 'mern.jpg',
    author: new mongoose.Types.ObjectId(), // placeholder
    category: new mongoose.Types.ObjectId(),
    tags: ['mern', 'webdev', 'javascript'],
    isPublished: true,
    excerpt: 'A quick intro to the MERN stack for developers.',
  },
  {
    title: 'How to Build REST APIs with Express',
    content:
      'Express makes building RESTful APIs fast and flexible. Learn the core principles and middleware usage.',
    featuredImage: 'express.jpg',
    author: new mongoose.Types.ObjectId(),
    category: new mongoose.Types.ObjectId(),
    tags: ['express', 'api', 'backend'],
    isPublished: true,
    excerpt: 'Master the essentials of Express.js API design.',
  },
  {
    title: 'Why MongoDB is Great for Developers',
    content:
      'MongoDB offers flexibility and scalability with its NoSQL document structure.',
    featuredImage: 'mongodb.jpg',
    author: new mongoose.Types.ObjectId(),
    category: new mongoose.Types.ObjectId(),
    tags: ['mongodb', 'database', 'nosql'],
    isPublished: true,
    excerpt: 'Understanding the advantages of MongoDB.',
  },
];

// --- 4️⃣ Seed Function ---
const seedDatabase = async () => {
  try {
    await Post.deleteMany({});
    console.log('🧹 Old posts cleared.');

    for (const postData of posts) {
      const post = new Post(postData);
      await post.save(); // runs pre-save hook to create slug
    }

    console.log('🌱 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
