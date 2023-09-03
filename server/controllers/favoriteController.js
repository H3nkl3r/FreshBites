const favoriteModel = require("../models/Favorite");
const restaurantModel = require("../models/Restaurant");

const getFavoritesList = async (req, res) => {
  try {
    const userId = req.user._id;

    let favorites = await favoriteModel
      .findOne({ user: userId })
      .populate("restaurants");

    if (!favorites) {
      favorites = new favoriteModel({ user: userId });
    }
    res.status(200).json({ restaurants: favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: " Internal Server Error" });
  }
};

const isFavorite = async (req, res) => {
  const restaurantId = req.query.restaurantId;
  if (!restaurantId) {
    return res.status(400).json({ error: "No restaurant ID provided" });
  }
  try {
    let isFavorite = false;
    const favorites = await favoriteModel.findOne({ user: req.user._id });
    if (!favorites) {
      return res.status(200).json({ isFavorite });
    }
    favorites.restaurants.forEach((favorite) => {
      if (favorite.equals(restaurantId)) {
        isFavorite = true;
      }
    });
    res.status(200).json({ isFavorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createFavoriteEntry = async (req, res) => {
  const userId = req.user._id;
  const restaurantId = req.body.restaurantId;

  if (!restaurantId) {
    return res.status(400).json({ error: "No restaurant ID provided" });
  }

  try {
    const restaurant = await restaurantModel.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    let favorites = await favoriteModel.findOne({ user: userId });

    if (!favorites) {
      favorites = new favoriteModel({ user: userId });
    }

    if (favorites.restaurants.includes(restaurantId)) {
      return res
        .status(200)
        .json({ message: "Restaurant already in favorites" });
    }

    favorites.restaurants.push(restaurantId);
    await favorites.save();

    res
      .status(200)
      .json({ favorites: favorites, message: "Restaurant added to favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteFavoriteEntry = async (req, res) => {
  const userId = req.user._id;
  const restaurantId = req.body.restaurantId;

  if (!restaurantId) {
    return res.status(400).json({ error: "No restaurant ID provided" });
  }

  try {
    const restaurant = await restaurantModel.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const favorites = await favoriteModel.findOne({ user: userId });
    if (!favorites || !favorites.restaurants.includes(restaurantId)) {
      return res.status(200).json(favorites);
    }
    favorites.restaurants = favorites.restaurants.filter(
      (id) => id.toString() !== restaurantId
    );
    await favorites.save();

    res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteFavoritesList = async (userId) => {
  await favoriteModel.deleteMany({ user: userId });
};

module.exports = {
  getFavoritesList,
  isFavorite,
  createFavoriteEntry,
  deleteFavoriteEntry,
  deleteFavoritesList,
};
