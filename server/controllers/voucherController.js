const VoucherModel = require("../models/Voucher");
const UserModel = require("../models/User");
const RestaurantModel = require("../models/Restaurant");

const sgMail = require("@sendgrid/mail");
const fs = require("fs").promises;
const path = require("path");
const qrCode = require("qrcode");
const moment = require("moment");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const reviewsNecessaryForVoucher = 3;

/*
Helper function just for sending emails to the user
 */
const sendVoucherPerEmail = async (restaurant, user, voucher) => {
  const params = new URLSearchParams({ voucherId: voucher._id });
  const qrCodeData = `http://localhost:3000/vouchervalidation?${params}`;
  const qrUrl = `http://localhost:3000/vouchervalidation/${voucher._id}`;
  const qrCodeImagePath = `tmp/voucher${restaurant._id}${user._id}.png`;

  try {
    await qrCode.toFile(qrCodeImagePath, qrCodeData);

    const data = await fs.readFile(qrCodeImagePath, { encoding: "base64" });

    try {
      await fs.unlink(qrCodeImagePath);
    } catch (err) {
      console.error("Error deleting temp file", err);
    }

    // Include the QR code in the email's HTML content
    const name = user.firstName;
    const emailContent = `<p>Dear ${name},</p>
                          <p>Congratulations! You can find your voucher for ${restaurant.name} below.</p>
                          <a href="${qrUrl}"><img src="data:image/png;base64,${data}" alt="QR Code"></a>`;

    const msg = {
      to: user.email,
      from: "discount.freshbites@gmail.com",
      subject: `Your Voucher for ${restaurant.name}!`,
      html: emailContent,
    };

    await sgMail.send(msg);
  } catch (e) {
    throw e;
  }
};

/*
Helper function to check if there was any premium voucher issued in the past 30 days
 */
const recentPremiumVoucher = async (userId, restaurantId) => {
  const thirtyDaysAgo = moment().subtract(30, "days");
  const recentVoucher = await VoucherModel.findOne({
    user: userId,
    restaurant: restaurantId,
    voucherType: "PREMIUM",
    createdAt: { $gt: thirtyDaysAgo },
  });
  return Boolean(recentVoucher);
};

/*
Helper function to clear the tmp directory
 */
const clearTmpDirectory = async () => {
  const directory = "./tmp";
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
};

const loyaltyVoucherStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId);

    const loyaltyVoucherAvailable =
      user.reviewCounter >= reviewsNecessaryForVoucher;
    res.status(200).json({
      userId: userId,
      loyaltyVoucherAvailable: loyaltyVoucherAvailable,
      reviewCounter: user.reviewCounter,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const premiumVoucherStatus = async (req, res) => {
  const restaurantId = req.query.restaurantId;
  if (!restaurantId) {
    return res.status(400).json({ error: "No restaurant ID provided" });
  }

  try {
    if (req.user.role !== "PREMIUM") {
      return res.status(200).json({ premiumVoucherAvailable: false });
    }
    const premiumVoucherAvailable = !(await recentPremiumVoucher(
      req.user._id,
      restaurantId
    ));

    res.status(200).json({ premiumVoucherAvailable });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const issueLoyaltyVoucher = async (req, res) => {
  const restaurantId = req.body.restaurantId;
  if (!restaurantId) {
    return res.status(400).json({ error: "No restaurant ID provided" });
  }

  try {
    const reviewCounter = req.user.reviewCounter;
    if (reviewCounter < reviewsNecessaryForVoucher) {
      return res.status(403).json({ error: "Not enough reviews" });
    }

    // Send voucher per email
    const restaurant = await RestaurantModel.findById(restaurantId);

    const voucher = await new VoucherModel({
      user: req.user._id,
      restaurant: restaurant,
      voucherType: "LOYALTY",
      amount: "2:1",
      valid: true,
    });
    await voucher.save();
    await UserModel.updateOne(
      { _id: req.user._id },
      { reviewCounter: reviewCounter - reviewsNecessaryForVoucher }
    );
    await sendVoucherPerEmail(restaurant, req.user, voucher);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Internal Server Error" });
  } finally {
    // Clear the entire tmp directory
    clearTmpDirectory();
  }
};

const issuePremiumVoucher = async (req, res) => {
  const restaurantId = req.body.restaurantId;
  if (!restaurantId) {
    return res.status(400).json({ error: "No restaurant ID provided" });
  }
  try {
    // Check if user is premium
    if (req.user.role !== "PREMIUM") {
      return res.status(403).json({ error: "Missing premium status" });
    }

    const premiumVoucherAvailable = !(await recentPremiumVoucher(
      req.user._id,
      restaurantId
    ));

    if (premiumVoucherAvailable) {
      const voucher = await new VoucherModel({
        user: req.user._id,
        restaurant: restaurantId,
        voucherType: "PREMIUM",
        amount: "25%",
        valid: true,
      });
      await voucher.save();
      const restaurant = await RestaurantModel.findById(restaurantId);
      await sendVoucherPerEmail(restaurant, req.user, voucher);
      res.status(200).send();
    } else {
      res.status(403).json({ error: "Voucher used already" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Clear the entire tmp directory
    clearTmpDirectory();
  }
};

const getVoucherData = async (req, res) => {
  const { voucherId } = req.query;

  if (!voucherId) {
    return res.status(400).json({ error: "No query provided" });
  }
  try {
    const voucher = await VoucherModel.findById(voucherId);
    return res.status(200).send(voucher);
  } catch (e) {
    res.status(404).json({ error: "Voucher not found" });
    console.log(e);
  }
};
const invalidate = async (req, res) => {
  const { voucherId } = req.body;
  if (!voucherId) {
    return res.status(400).json({ error: "Voucher ID was not provided" });
  }
  try {
    const voucher = await VoucherModel.findById(voucherId);

    if (!voucher) {
      return res.status(400).json({ error: "Voucher does not exist" });
    }

    await VoucherModel.updateOne({ _id: voucher._id }, { valid: false });
    res.status(200).send();
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(e);
  }
};

// Export
module.exports = {
  loyaltyVoucherStatus,
  premiumVoucherStatus,
  issueLoyaltyVoucher,
  issuePremiumVoucher,
  invalidate,
  getVoucherData,
};
