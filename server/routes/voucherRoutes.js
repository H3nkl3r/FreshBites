const express = require("express");
const router = express.Router();

const voucherController = require("../controllers/voucherController");
const AuthProvider = require("../middlewares/authMiddleware");

// Define all routes
router.get(
  "/loyaltyVoucherStatus",
  AuthProvider.checkAuth,
  AuthProvider.permit(AuthProvider.roles.PREMIUM, AuthProvider.roles.FREE),
  voucherController.loyaltyVoucherStatus
);
router.get(
  "/premiumVoucherStatus",
  AuthProvider.checkAuth,
  AuthProvider.permit(AuthProvider.roles.PREMIUM, AuthProvider.roles.FREE),
  voucherController.premiumVoucherStatus
);
router.get("/get", voucherController.getVoucherData);
router.patch(
  "/invalidate",
  AuthProvider.checkAuth,
  AuthProvider.checkVoucherPermission,
  voucherController.invalidate
);
router.post(
  "/issueLoyaltyVoucher",
  AuthProvider.checkAuth,
  AuthProvider.permit(AuthProvider.roles.PREMIUM, AuthProvider.roles.FREE),
  voucherController.issueLoyaltyVoucher
);
router.post(
  "/issuePremiumVoucher",
  AuthProvider.checkAuth,
  AuthProvider.permit(AuthProvider.roles.PREMIUM),
  voucherController.issuePremiumVoucher
);

// Export router
module.exports = router;
