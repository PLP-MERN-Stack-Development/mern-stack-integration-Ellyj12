const { body, validationResult } = require("express-validator");

const validatePostCreate = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 20 })
    .withMessage("Title cannot exceed 20 characters"),

  body("author")
    .notEmpty()
    .withMessage("Author is required")
    .isLength({ max: 20 })
    .withMessage("Author cannot exceed 20 characters"),

  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 50, max: 200 })
    .withMessage("Content must be 50-200 characters"),

  body("excerpt")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Excerpt cannot exceed 100 characters"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be true or false"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["Technology", "Lifestyle", "Education", "Health", "Travel"])
    .withMessage("Category must be one of the allowed values"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

module.exports = validatePostCreate;
