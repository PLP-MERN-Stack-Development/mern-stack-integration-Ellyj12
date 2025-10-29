const express = require("express");
const router = express.Router();
const Post = require("../models/PostModel");
const slugify = require("slugify");
const asyncHandler = require("../utils/asyncHandler");
const validatePostCreate = require("../middlewear/postValidationCreate");
const validatePostUpdate = require("../middlewear/postValidationUpdate");

// GET all posts
router.get("/", asyncHandler(async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
}));

// GET post by ID
router.get("/:id", asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  res.json(post);
}));

// CREATE a post
router.post("/",validatePostCreate,asyncHandler(async (req, res) => {
  const { title, author, content, excerpt, tags, isPublished, slug } = req.body;

  if (!title || !author || !content) {
    res.status(400);
    throw new Error("title, author, content are required.");
  }

  const postSlug = slug || slugify(title, { lower: true, strict: true });

  const newPost = new Post({
    title,
    author,
    content,
    excerpt,
    tags,
    isPublished,
    slug: postSlug,
  });

  const savedPost = await newPost.save();
  res.status(201).json(savedPost);
}));

// UPDATE a post
router.put("/:id", validatePostUpdate, asyncHandler(async (req, res) => {
  // Only pick the fields that exist in req.body
  const updateData = {};

  const allowedFields = ["title", "author", "content", "excerpt", "slug", "tags", "isPublished"];
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });


  if (!updateData.slug && updateData.title) {
    updateData.slug = slugify(updateData.title, { lower: true, strict: true });
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedPost) {
    res.status(404);
    throw new Error("Post not found");
  }

  res.json({
    message: "Post updated successfully",
    post: updatedPost,
  });
}));

// DELETE a post
router.delete("/:id", asyncHandler(async (req, res) => {
  const deletedPost = await Post.findByIdAndDelete(req.params.id);

  if (!deletedPost) {
    res.status(404);
    throw new Error("Post not found");
  }

  res.json({
    message: "Post deleted successfully",
    deletedPost,
  });
}));

module.exports = router;
