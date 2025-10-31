const Post = require("../models/PostModel");
const Category = require("../models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("../utils/asyncHandler");

// GET all posts with pagination, search & category filter
const getAllPosts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = {};

  // Search by title (case-insensitive)
  if (req.query.search) {
    query.title = { $regex: req.query.search, $options: "i" };
  }

  // Filter by category (category id)
  if (req.query.category) {
    query.category = req.query.category;
  }

  const totalPosts = await Post.countDocuments(query);

  const posts = await Post.find(query)
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalPosts / limit);

  res.json({
    posts,
    totalPages,
    currentPage: page,
    totalPosts,
  });
});

// GET single post by ID
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("category", "name");

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  res.json(post);
});

// CREATE post
const createPost = asyncHandler(async (req, res) => {
  const user = req.user; 
  if (!user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const { title, content, excerpt, tags, isPublished, slug, category } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("Please provide title and content");
  }

  const categoryDoc = await Category.findById(category);
  if (!categoryDoc) {
    res.status(400);
    throw new Error("Invalid category");
  }

  const finalSlug = slug
    ? slugify(slug, { lower: true, strict: true })
    : slugify(title, { lower: true, strict: true });

  const post = new Post({
    title,
    author: user.username,
    content,
    excerpt,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim())) : [],
    isPublished: isPublished ?? true,
    slug: finalSlug,
    category: categoryDoc._id,
    featuredImage: req.file ? req.file.filename : undefined,
  });

  const createdPost = await post.save();
  const populatedPost = await Post.findById(createdPost._id).populate("category", "name");

  res.status(201).json(populatedPost);
});

// UPDATE post
const updatePost = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const { id } = req.params;
  const { title, content, excerpt, tags, isPublished, slug, category } = req.body;

  const post = await Post.findById(id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  // Update fields
  post.title = title || post.title;
  post.content = content || post.content;
  post.excerpt = excerpt !== undefined ? excerpt : post.excerpt;
  post.tags = tags ? (Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim())) : post.tags;
  post.isPublished = isPublished !== undefined ? isPublished : post.isPublished;

  // Update slug
  if (slug) {
    post.slug = slugify(slug, { lower: true, strict: true });
  } else if (title) {
    post.slug = slugify(title, { lower: true, strict: true });
  }

  // Update category if provided
  if (category) {
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      res.status(400);
      throw new Error("Invalid category");
    }
    post.category = categoryDoc._id;
  }

  // Update author (optional)
  post.author = user.username;

  // Update featured image
  if (req.file) {
    post.featuredImage = req.file.filename;
  }

  const updatedPost = await post.save();
  const populatedPost = await Post.findById(updatedPost._id).populate("category", "name");

  res.json({
    message: "Post updated successfully",
    post: populatedPost,
  });
});

// DELETE post
const deletePost = asyncHandler(async (req, res) => {
  const deletedPost = await Post.findByIdAndDelete(req.params.id);

  if (!deletedPost) {
    res.status(404);
    throw new Error("Post not found");
  }

  res.json({
    message: "Post deleted successfully",
    deletedPost,
  });
});

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
