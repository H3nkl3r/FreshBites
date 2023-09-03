const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const AuthProvider = require("../middlewares/authMiddleware");

// Define all routes
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.patch("/update", AuthProvider.checkAuth, userController.updateUser);
router.delete("/delete", AuthProvider.checkAuth, userController.deleteUser);
router.get("/me", AuthProvider.checkAuth, userController.me);
router.get("/checkExisting", userController.checkExisting);
router.patch("/activatePremium", userController.activatePremium);
router.patch(
  "/unsubscribe",
  AuthProvider.checkAuth,
  userController.unsubscribe
);
router.get(
  "/restaurantPermission",
  AuthProvider.checkAuth,
  userController.checkRestaurantPermission
);
router.get(
  "/voucherPermission",
  AuthProvider.checkAuth,
  userController.checkVoucherPermission
);
router.get("/get", AuthProvider.checkAuth, userController.get);

// Export router
module.exports = router;
