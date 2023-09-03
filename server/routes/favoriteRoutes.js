const express = require("express");
const router = express.Router();

const favoriteController = require("../controllers/favoriteController");
const AuthProvider = require("../middlewares/authMiddleware");

// Define all favorite routes
router.get("/", AuthProvider.checkAuth, favoriteController.getFavoritesList);

router.get(
  "/isFavorite",
  AuthProvider.checkAuth,
  favoriteController.isFavorite
);

router.put(
  "/add",
  AuthProvider.checkAuth,
  favoriteController.createFavoriteEntry
);

router.put(
  "/remove",
  AuthProvider.checkAuth,
  favoriteController.deleteFavoriteEntry
);

// Export router
module.exports = router;
