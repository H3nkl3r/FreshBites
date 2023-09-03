const mongoose = require("mongoose");

// Define schema
const restaurantSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    lowercase: true,
    default: () => "",
  },
  cuisineType: {
    type: [String],
    default: () => [],
  },
  menuURL: {
    type: String,
    default: () => "",
  },
  images: {
    type: [String],
    default: () => [],
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: {
      street: String,
      houseNumber: Number,
      zip: Number,
      city: String,
      country: String,
    },
    required: true,
  },
  location: {
    // add geospatial data
    type: { type: String, default: "Point", required: true, enum: ["Point"] },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  description: {
    type: String,
    required: true,
  },
  openingHours: {
    type: JSON,
    default: () => {},
  },
  specialRequirements: {
    type: [String],
    default: () => [],
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  averageRating: {
    type: Number,
    default: () => 0,
  },
  numberOfReviews: {
    type: Number,
    default: () => 0,
  },
  numberOfClicksThisMonth: {
    type: Number,
    default: () => 0,
  },
  openingDate: {
    type: Date,
    required: true,
  },

  // Stripe subscription Id to retrieve status of subscription from stripe
  subscriptionStripeId: {
    type: String,
    default: "subscriptionStripeID",
  },
  // is updated to true, if payment was successful
  subscriptionActive: {
    type: Boolean,
    default: () => false,
  },

  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

restaurantSchema.index({ location: "2dsphere" }, { sparse: false });

// Export
module.exports = mongoose.model("Restaurant", restaurantSchema);
