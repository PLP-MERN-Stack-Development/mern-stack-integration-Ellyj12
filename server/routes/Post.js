const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const validatePostCreate = require("../middlewear/postValidationCreate");
const validatePostUpdate = require("../middlewear/postValidationUpdate");
const { protect, authorize } = require('../middlewear/auth');
const upload = require('../middlewear/uploads')


const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require("../controllers/postController");




router.get("/", getAllPosts);

router.get("/:id", getPostById);

router.post(
  "/",
  protect,  upload.single("featuredImage"),
  authorize('user', 'admin'),
  validatePostCreate,
  createPost
);


router.put(
  "/:id",
  protect,
  authorize('admin'),
  validatePostUpdate,
  updatePost
);
router.delete("/:id", protect, authorize("admin"), deletePost);

module.exports = router;

