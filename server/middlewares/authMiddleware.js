const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const RestaurantModel = require("../models/Restaurant");
const VoucherModel = require("../models/Voucher");

const checkAuth = async (req, res, next) => {
  try {
    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in the environment variables.");
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if authorization header is available
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No authorization header provided" });
    }

    // Split token from Bearer
    const token = req.headers.authorization.split(" ")[1];

    // Check if token is available
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verifiedToken.userId);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (e) {
    // Detect token expiration error
    if (e instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Generic error handling
    console.error("An error occurred during authentication", e);
    res.status(400).json({ error: "Bad Request: Invalid token" });
  }
};

const roles = {
  FREE: "FREE",
  PREMIUM: "PREMIUM",
  OWNER: "OWNER",
};

const permit = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user logged in" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden: You don't have permission to access this resource",
      });
    }

    next();
  };
};

const checkRestaurantPermission = async (req, res, next) => {
  const restaurantId = req.body.restaurantId;
  if (!restaurantId) {
    return res.status(400).json({ error: "No restaurant ID provided" });
  }
  try {
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    if (!restaurant.owner.equals(req.user._id)) {
      return res.status(403).json({ error: "No authorization" });
    }
    req.restaurant = restaurant;

    next();
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkVoucherPermission = async (req, res, next) => {
  const voucherId = req.body.voucherId;
  if (!voucherId) {
    return res.status(400).json({ message: "No voucher ID provided" });
  }
  try {
    const voucher = await VoucherModel.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    const restaurantId = voucher.restaurant;
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (!restaurant.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "No authorization" });
    }
    req.voucher = voucher;

    next();
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  checkAuth,
  roles,
  permit,
  checkRestaurantPermission,
  checkVoucherPermission,
};
