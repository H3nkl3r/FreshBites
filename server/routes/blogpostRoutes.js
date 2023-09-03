const express = require("express");
const multer = require("multer");
const router = express.Router();

const blogpostController = require("../controllers/blogpostController");
const AuthProvider = require("../middlewares/authMiddleware");

// Define all blogpost routes
router.get("/get", blogpostController.getBlogposts);
router.get("/getOne", blogpostController.getBlogpostById);
router.get("/getByRestaurant", blogpostController.getBlogpostByRestaurant);

router.post(
  "/create",
  AuthProvider.checkAuth,
  AuthProvider.checkRestaurantPermission,
  blogpostController.createBlogpost
);

router.delete(
  "/delete",
  AuthProvider.checkAuth,
  AuthProvider.checkRestaurantPermission,
  blogpostController.deleteBlogpost
);

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
    fileSize: 1024 * 1024 * process.env.MAX_UPLOAD_SIZE,
  },
});

router.post(
  "/uploadImage",
  upload.single("image"),
  blogpostController.uploadImage
);

// Export router
module.exports = router;
