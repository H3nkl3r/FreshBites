const express = require("express");
const multer = require("multer");
const router = express.Router();
require("dotenv").config();

const restaurantController = require("../controllers/restaurantController");
const AuthProvider = require("../middlewares/authMiddleware");

// Define all routes
router.get("/get", restaurantController.getRestaurants);
router.get(
  "/getLocationAutocomplete",
  restaurantController.getLocationAutocomplete
);
router.get(
  "/getAutocompleteRestaurantName",
  restaurantController.getAutocompleteRestaurantName
);
router.post("/create", restaurantController.createRestaurant);

// Specify the temporary destination to store uploaded files
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * process.env.MAX_UPLOAD_SIZE, // 30MB (in bytes)
  },
});

router.post(
  "/uploadImages",
  upload.array("images"),
  AuthProvider.checkAuth,
  AuthProvider.checkRestaurantPermission,
  restaurantController.uploadImages
);
router.post(
  "/uploadMenu",
  upload.single("menu"),
  AuthProvider.checkAuth,
  AuthProvider.checkRestaurantPermission,
  restaurantController.uploadMenu
);

router.patch(
  "/updateInformation",
  AuthProvider.checkAuth,
  AuthProvider.checkRestaurantPermission,
  restaurantController.updateRestaurant
);

router.patch("/click", restaurantController.clickRestaurant);
// Does not need authentication middleware -> authentication is done via stripe session ID
router.patch("/activateRestaurant", restaurantController.activateRestaurant);
router.patch(
  "/updateInformation",
  AuthProvider.checkAuth,
  AuthProvider.checkRestaurantPermission,
  restaurantController.updateRestaurant
);

// Does not need authentication middleware -> authentication is done via stripe session ID
router.delete("/checkToDelete", restaurantController.checkToDelete);
router.delete(
  "/delete",
  AuthProvider.checkAuth,
  AuthProvider.checkRestaurantPermission,
  restaurantController.deleteRestaurant
);

// Export router
module.exports = router;
