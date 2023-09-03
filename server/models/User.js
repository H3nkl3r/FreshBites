const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please use a valid email address."],
    },
    role: {
      type: String,
      enum: ["FREE", "PREMIUM", "OWNER"],
      default: "FREE",
    },
    // Stripe subscription Id to retrieve status of subscription from stripe
    subscriptionStripeId: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      // Example of minimum password length
      minlength: [8, "Password must be at least 8 characters long."],
    },
    reviewCounter: {
      type: Number,
      default: () => 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for email field
userSchema.index({ email: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Specify salt rounds
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check if the entered password matches the hashed password in the database
userSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
