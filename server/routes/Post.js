const express = require("express");
const router = express.Router();
const Post = require("../models/PostModel");
const slugify = require('slugify')

// Get all posts
router.get("/", async (req, res) => {
  console.log("get post routes");
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

// Find a specific post by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    console.log(post);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Create a post
router.post("/", async (req, res) => {
  try {
    const { title, author, content, excerpt, tags, isPublished } = req.body;

    if (!title || !author || !content) {
      return res
        .status(400)
        .json({ message: "title, author, content are required." });
    }

    const newPost = new Post({
      title,
      author,
      content,
      excerpt,
      tags,
      isPublished,
    });

    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Slug must be unique." });
    }
    res.status(500).json({ message: error.message });
  }
});
// Update the post 
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, content, excerpt, slug, tags, isPublished } =
      req.body;

   
    let updatedSlug =
      slug ||
      (title ? slugify(title, { lower: true, strict: true }) : undefined);

    // Perform the update
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        author,
        content,
        excerpt,
        slug: updatedSlug,
        tags,
        isPublished,
      },
      { new: true, runValidators: true }
    );

    // If post not found
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Return updated post
    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
     if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    // Handle duplicate slug errors
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slug must be unique.' });
    }

    // General server error
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
