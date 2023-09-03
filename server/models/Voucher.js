const mongoose = require("mongoose");

// Define schema
const voucherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    voucherType: {
      type: String,
      enum: ["PREMIUM", "LOYALTY"],
      required: true,
    },
    amount: {
      type: String,
      required: true, // IF PREMIUM: 25%, ELSE IF FREE: 2 for 1
    },
    valid: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

// Export
module.exports = mongoose.model("Voucher", voucherSchema);
