const express = require("express");
const { body } = require("express-validator");
const { getStores, submitRating } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, authorize("user"));

router.get("/stores", getStores);

router.post(
  "/ratings",
  [
    body("storeId").isInt().withMessage("Store ID must be an integer"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
  ],
  submitRating
);

module.exports = router;
