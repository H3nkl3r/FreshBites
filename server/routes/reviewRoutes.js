const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const AuthProvider = require("../middlewares/authMiddleware");

// Define all routes
router.get("/get", reviewController.getReview);

router.post("/create", AuthProvider.checkAuth, reviewController.createReview);

// Export router
module.exports = router;
