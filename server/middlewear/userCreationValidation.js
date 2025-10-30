const { body, validationResult } = require("express-validator");

const userCreationValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 4, max: 15 })
    .withMessage("Username must be between 4 and 15 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),

    body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage('Invalid email'),

    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },


];

module.exports = userCreationValidation
