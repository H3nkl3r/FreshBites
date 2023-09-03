const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");

// Payment routes
router.post(
  "/createRestaurantPaymentSession",
  paymentController.createRestaurantPaymentSession
);
router.post(
  "/createUserPaymentSession",
  paymentController.createUserPaymentSession
);

// Export router
module.exports = router;
