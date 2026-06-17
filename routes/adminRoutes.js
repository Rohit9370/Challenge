const express = require("express");
const { body } = require("express-validator");
const {
  getDashboard,
  createUser,
  createStore,
  getStores,
  getUsers,
  getUserDetails,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));

const nameValidation = body("name")
  .isLength({ min: 20, max: 60 })
  .withMessage("Name must be 20-60 characters");

const emailValidation = body("email").isEmail().withMessage("Must be a valid email");

const addressValidation = body("address")
  .isLength({ max: 400 })
  .withMessage("Address must not exceed 400 characters");

const passwordValidation = body("password")
  .isLength({ min: 8, max: 16 })
  .withMessage("Password must be 8-16 characters")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage("Password must contain at least one special character");

router.get("/dashboard", getDashboard);

router.post(
  "/users",
  [nameValidation, emailValidation, addressValidation, passwordValidation],
  createUser
);

router.post(
  "/stores",
  [nameValidation, emailValidation, addressValidation],
  createStore
);

router.get("/stores", getStores);
router.get("/users", getUsers);
router.get("/users/:id", getUserDetails);

module.exports = router;
