const Post = require("../models/PostModel");
const Category = require("../models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("../utils/asyncHandler");


const getAllPosts = asyncHandler(async (req, res) => {

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10; 
  const skip = (page - 1) * limit;

  
  const totalPosts = await Post.countDocuments();

  const posts = await Post.find()
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


const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("category", "name");
  
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  
  res.json(post);
});


const createPost = asyncHandler(async (req, res) => {
  const { title, author, content, excerpt, tags, isPublished, slug, category } =
    req.body;


  if (!title || !author || !content) {
    res.status(400);
    throw new Error("Please provide title, author, and content");
  }


  const categoryDoc = await Category.findOne({ name: category });
  if (!categoryDoc) {
    res.status(400);
    throw new Error("Invalid category");
  }


  const finalSlug = slug
    ? slugify(slug, { lower: true, strict: true })
    : slugify(title, { lower: true, strict: true });

  const post = new Post({
    title,
    author,
    content,
    excerpt,
    tags,
    isPublished,
    slug: finalSlug,
    category: categoryDoc._id,
    featuredImage:req.file ? req.file.path : undefined,
  });

  const createdPost = await post.save();
  
 
  const populatedPost = await Post.findById(createdPost._id).populate(
    "category",
    "name"
  );
  
  res.status(201).json(populatedPost);
});


const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, author, content, excerpt, tags, isPublished, slug, category } =
    req.body;

  const post = await Post.findById(id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  
  post.title = title || post.title;
  post.author = author || post.author;
  post.content = content || post.content;
  post.excerpt = excerpt !== undefined ? excerpt : post.excerpt;
  post.tags = tags || post.tags;
  post.isPublished = isPublished !== undefined ? isPublished : post.isPublished;

 
  if (slug) {
    post.slug = slugify(slug, { lower: true, strict: true });
  } else if (title) {
    post.slug = slugify(title, { lower: true, strict: true });
  }


  if (category) {
    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      res.status(400);
      throw new Error("Invalid category");
    }
    post.category = categoryDoc._id;
  }

  const updatedPost = await post.save();


  const populatedPost = await Post.findById(updatedPost._id).populate(
    "category",
    "name"
  );
  
  res.json({
    message: "Post updated successfully",
    post: populatedPost,
  });
});

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
  deletePost
  
};

