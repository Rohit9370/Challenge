const express = require("express");
const { getDashboard } = require("../controllers/ownerController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, authorize("owner"));

router.get("/dashboard", getDashboard);

module.exports = router;
