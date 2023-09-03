const mongoose = require("mongoose");

// Define schema
const reviewverificationSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
  },
  restaurant: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

// Export
module.exports = mongoose.model("ReviewVerification", reviewverificationSchema);
