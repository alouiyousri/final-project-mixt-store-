const { body, validationResult } = require("express-validator");

// Registration Validation
const registerValidation = () => [
  body("email", "Email is required").isEmail(),
  body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
];

// Login Validation
const loginValidation = () => [
  body("email", "Email is required").isEmail(),
  body("password", "Password is required").notEmpty(),
];

// Order Validation (FULL - including nested item checks)
const orderValidation = () => [
  body("customerInfo").isObject().withMessage("Customer info is required"),

  body("customerInfo.name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("customerInfo.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isString()
    .withMessage("Phone must be a string"),

  body("customerInfo.location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must have at least one item"),

  body("items.*.name")
    .notEmpty()
    .withMessage("Each item must have a name"),

  body("items.*.price")
    .isNumeric()
    .withMessage("Each item must have a numeric price"),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Each item must have a quantity >= 1"),

  body("total")
    .isNumeric()
    .withMessage("Total must be a number"),
];

// Global validation middleware
const validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  orderValidation,
  validation,
};
