const express = require("express");
const { body } = require("express-validator");
const { register, login, updatePassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const passwordValidation = body("password")
  .isLength({ min: 8, max: 16 })
  .withMessage("Password must be 8-16 characters")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage("Password must contain at least one special character");

router.post(
  "/register",
  [
    body("name")
      .isLength({ min: 20, max: 60 })
      .withMessage("Name must be 20-60 characters"),
    body("email").isEmail().withMessage("Must be a valid email"),
    body("address")
      .isLength({ max: 400 })
      .withMessage("Address must not exceed 400 characters"),
    passwordValidation,
  ],
  register
);

router.post("/login", login);

router.put(
  "/update-password",
  protect,
  [body("newPassword")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8-16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character")],
  updatePassword
);

module.exports = router;
