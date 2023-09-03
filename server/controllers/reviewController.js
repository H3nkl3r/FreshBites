const ReviewModel = require("../models/Review");
const ReviewVerificationModel = require("../models/Reviewverification");
const RestaurantModel = require("../models/Restaurant");
const UserModel = require("../models/User");

/*
Query for a single restaurant with a given restaurant name
 */
const getReview = async (req, res) => {
  const restaurantID = req.query.restaurantID;
  if (!restaurantID) {
    return res.status(400).json({ error: "No restaurant ID provided" });
  }

  try {
    // Find the restaurant with the given name
    const restaurant = await RestaurantModel.findOne({
      _id: restaurantID,
    });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Find the reviews associated with the restaurant
    const reviews = await ReviewModel.find({
      restaurant: restaurantID,
    })
      .populate("user", "firstName")
      .exec();

    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the review" });
  }
};

const createReview = async (req, res) => {
  if (
    !req.body.code ||
    !req.body.restaurant ||
    !req.body.numbStars ||
    !req.body.description
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const code = req.body.code;
    const restaurantID = req.body.restaurant;
    const userId = req.user._id;
    const reviewVerification = await ReviewVerificationModel.findOne({
      code: code,
      restaurant: restaurantID,
    }).exec();

    if (!reviewVerification) {
      return res
        .status(400)
        .send({ error: "Review code does not match the restaurant" });
    }

    const formerReviews = await ReviewModel.find({
      user: userId,
      restaurant: restaurantID,
    });

    if (formerReviews.length > 0) {
      return res
        .status(400)
        .send({ error: "Restaurant has been rated already" });
    }

    const newReview = new ReviewModel({
      user: userId,
      restaurant: restaurantID,
      numbStars: req.body.numbStars,
      description: req.body.description,
    });
    await newReview.save();

    // get number of reviews for restaurant and average rating
    const restaurant = await RestaurantModel.findOne({
      _id: restaurantID,
    }).exec();
    const prevAvg = parseFloat(restaurant.averageRating);
    const prevNum = parseFloat(restaurant.numberOfReviews);

    const avg =
      (prevAvg * prevNum + parseFloat(req.body.numbStars)) / (prevNum + 1);

    await RestaurantModel.updateOne(
      { _id: restaurantID },
      { averageRating: avg, numberOfReviews: prevNum + 1 }
    ).exec();

    await UserModel.updateOne({ _id: userId }, { $inc: { reviewCounter: 1 } });

    res.status(201).json(req.body);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const deleteReviews = async (userId) => {
  const reviews = await ReviewModel.find({ user: userId });
  for (const review of reviews) {
    let restaurantId = review.restaurant;
    let restaurant = await RestaurantModel.findById(restaurantId);
    let rating = review.numbStars;
    const prevAvg = parseFloat(restaurant.averageRating);
    const prevNum = parseFloat(restaurant.numberOfReviews);
    let avg;
    if (prevNum === 1) {
      avg = 0;
    } else {
      avg = (prevAvg * prevNum - rating) / (prevNum - 1);
    }
    await RestaurantModel.updateOne(
      { _id: restaurantId },
      { averageRating: avg, numberOfReviews: prevNum - 1 }
    ).exec();
    await review.delete();
  }
};

// Export
module.exports = {
  getReview,
  createReview,
  deleteReviews,
};
