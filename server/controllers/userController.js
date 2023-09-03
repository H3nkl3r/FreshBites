const UserModel = require("../models/User");
const RestaurantModel = require("../models/Restaurant");
const jwt = require("jsonwebtoken");
const { genSalt, hash } = require("bcrypt");
const VoucherModel = require("../models/Voucher");
const { deleteFavoritesList } = require("./favoriteController.js");
const { deleteReviews } = require("./reviewController.js");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const createUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const userAlreadyExists = await UserModel.findOne({ email });
    if (userAlreadyExists) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const newUser = new UserModel(req.body);
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .json({ error: "Internal Server Error", details: e.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const { _id, firstName, lastName, role } = user;
    res
      .status(200)
      .json({ user: { _id, firstName, lastName, email, role }, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const stripeId = req.user.subscriptionStripeId;

    if (stripeId !== "") {
      //Cancel subscription in stripe
      const subscription = await stripe.subscriptions.cancel(stripeId);
      if (subscription.status === "canceled") {
        await UserModel.updateOne(
          { _id: userId },
          {
            $set: {
              role: "FREE",
              subscriptionStripeId: "",
            },
          }
        );
      }
    }
    await deleteFavoritesList(userId);
    await deleteReviews(userId);

    await UserModel.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;

    await UserModel.findOne({ userId });

    if (updateData.password) {
      const salt = await genSalt(10);
      updateData.password = await hash(updateData.password, salt);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true, // This option returns the modified document
      runValidators: true, // Ensures all validators run on the update
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const me = async (req, res) => {
  try {
    const { _id, firstName, lastName, email, role } = req.user;
    res.status(200).json({ user: { _id, firstName, lastName, email, role } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkExisting = async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: "No email provided" });
  }

  try {
    const result = await UserModel.findOne({
      email,
    }).exec();
    res.status(200).json({ userExists: Boolean(result) });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkRestaurantPermission = async (req, res) => {
  const restaurantId = req.query.restaurantId;
  if (!restaurantId) {
    return res.status(400).json({ error: "No restaurant ID provided" });
  }

  try {
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) {
      return res.status(400).json({ error: "Restaurant not found" });
    }
    if (restaurant.owner.equals(req.user._id)) {
      res.status(200).json({ eligibleToEdit: true });
    } else {
      res.status(200).json({ eligibleToEdit: false });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const activatePremium = async (req, res) => {
  try {
    const sessionId = req.body.sessionId;
    if (!sessionId) {
      return res.status(400).json({ error: "No checkout session ID provided" });
    }
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: "No user ID provided" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res
        .status(400)
        .json({ error: "No checkout session with given sessionId" });
    }
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );

    if (
      subscription.status !== "active" ||
      session.metadata.userId !== userId
    ) {
      return res.status(401).json({ error: "Activation not allowed" });
    }

    //activate subscription and save stripe subscription ID
    const result = await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          role: "PREMIUM",
          subscriptionStripeId: subscription.id,
        },
      }
    );
    const user = await RestaurantModel.findById(userId);
    if (result.modifiedCount === 1 || user.role === "PREMIUM") {
      res.status(200).send(result);
    } else {
      res
        .status(404)
        .json({ error: "User not found or could not be activated" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Failed to activate subscription" });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const user = req.user;
    const stripeId = user.subscriptionStripeId;

    if (stripeId !== "") {
      //Cancel subscription in stripe
      const subscription = await stripe.subscriptions.cancel(stripeId);
      if (subscription.status === "canceled") {
        await UserModel.updateOne(
          { _id: req.user._id },
          {
            $set: {
              role: "FREE",
              subscriptionStripeId: "",
            },
          }
        );
      }
    }
    return res.status(200).send();
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "Failed to activate subscription" });
  }
};

const checkVoucherPermission = async (req, res) => {
  const voucherId = req.query.voucherId;
  if (!voucherId) {
    return res.status(400).json({ error: "No voucher ID provided" });
  }
  try {
    const voucher = await VoucherModel.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ error: "Voucher not found" });
    }
    const restaurantId = voucher.restaurant;
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant.owner.equals(req.user._id)) {
      res.status(200).json({ eligibleToEdit: false });
    } else {
      res.status(200).json({ eligibleToEdit: true });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const get = async (req, res) => {
  try {
    // req.user is already set by the checkAuthUser middleware
    const { _id, firstName, lastName, email, password, reviewCounter, role } =
      req.user;
    res.status(200).json({
      user: {
        _id,
        firstName,
        lastName,
        email,
        password,
        reviewCounter,
        role,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Export
module.exports = {
  loginUser: loginUser,
  createUser: createUser,
  deleteUser: deleteUser,
  updateUser: updateUser,
  me,
  activatePremium,
  unsubscribe,
  checkExisting,
  get,
  checkRestaurantPermission,
  checkVoucherPermission,
};
