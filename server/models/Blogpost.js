const mongoose = require("mongoose");

// Define schema
const blogpostModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["blog", "successStory"],
    default: "blog",
  },
  image: {
    type: String,
    default: () => "",
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  createdAt: {
    type: Date,
    required: true,
    immutable: true,
    default: () => Date.now(),
  },
});

// Export
module.exports = mongoose.model("Blogpost", blogpostModel);