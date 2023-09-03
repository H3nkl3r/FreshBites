const mongoose = require("mongoose");

// Define schema
const reviewSchema = new mongoose.Schema({
  numbStars: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  restaurant: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
});

// Export
module.exports = mongoose.model("Review", reviewSchema);
