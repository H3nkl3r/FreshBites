const RestaurantModel = require("../models/Restaurant");
const UserModel = require("../models/User");
const BlogpostModel = require("../models/Blogpost");
const ReviewverificationModel = require("../models/Reviewverification");
const ReviewModel = require("../models/Review");
const VoucherModel = require("../models/Voucher");
const FavoriteModel = require("../models/Favorite");
const fs = require("fs").promises;
const path = require("path");
const cloudinary = require("cloudinary").v2;
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const {
  generateReviewCodes,
} = require("../controllers/reviewverificationController");
require("dotenv").config({ path: "../.env" });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getLocationAutocomplete = async (req, res) => {
  const { query, types } = req.query;

  if (!query || !types) {
    return res.status(400).json({ error: "Query or types are missing" });
  }

  const inputQuery = encodeURIComponent(query);
  let url = `https://geocode.search.hereapi.com/v1/geocode?q=${inputQuery}&in=countryCode:DEU&lang=en&limit=5&types=address&apiKey=${process.env.HERE_API_KEY}`;
  if (types === "area") {
    url = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${inputQuery}&types=area&in=countryCode:DEU&lang=en&apiKey=${process.env.HERE_API_KEY}`;
  }

  try {
    // fetch with bearer token
    const response = await fetch(url, {});
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from HERE API:", error);
    res.status(500).json({ error: "Failed to fetch data from HERE API" });
  }
};

// take string and return longitude and latitude
const getCoordinates = async (query) => {
  const inputQuery = encodeURIComponent(query);
  const url = `https://geocode.search.hereapi.com/v1/geocode?q=${inputQuery}&in=countryCode:DEU&lang=en&limit=1&apiKey=${process.env.HERE_API_KEY}`;

  try {
    // fetch with bearer token
    const response = await fetch(url, {});
    const data = await response.json();
    return data.items[0].position;
  } catch (error) {
    console.error("Error fetching data from HERE API:", error);
  }
};

const getAutocompleteRestaurantName = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No query provided" });
  }
  try {
    const restaurants = await RestaurantModel.find(
      {
        name: { $regex: new RegExp(query), $options: "i" }, // Use a case-insensitive regex match
        subscriptionActive: true,
      },
      "name"
    ); // Only return the name field from the document
    res.status(200).json({ items: restaurants });
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).json({ error: "Failed to fetch data from the database" });
  }
};

const getRestaurants = async (req, res) => {
  const {
    restaurantId,
    area,
    sortingOption,
    filter,
    page = 1,
    limit = 10,
    restaurantType,
    name,
    ownerId,
  } = req.query;

  if (
    !restaurantId &&
    !area &&
    !sortingOption &&
    !filter &&
    !restaurantType &&
    !name &&
    !ownerId
  ) {
    return res.status(400).json({ error: "No query provided" });
  }

  try {
    // If id is provided, return the restaurant with that ID
    if (restaurantId) {
      const restaurant = await RestaurantModel.findById(restaurantId);
      if (restaurant) {
        return res.status(200).send(restaurant);
      } else {
        return res.status(404).send({ error: "Restaurant not found" });
      }
    }

    if (ownerId) {
      const restaurant = await RestaurantModel.findOne({ owner: ownerId });
      if (restaurant) {
        return res.status(200).send(restaurant);
      } else {
        return res.status(404).send({ error: "Restaurant not found" });
      }
    }

    let filters = {};
    let type = {};
    let sorting = sortingOption;

    // Check if filter is defined
    if (filter) {
      try {
        filters = JSON.parse(filter);
      } catch (error) {
        console.error("Error parsing filter:", error);
      }
    }

    // Check if type is defined
    if (restaurantType) {
      type = restaurantType;
    }

    const selectedKitchens = Object.keys(filters.kitchenFilter || {}).filter(
      (kitchen) => filters.kitchenFilter[kitchen]
    );

    const selectedRequirements = Object.keys(
      filters.requirementFilter || {}
    ).filter((requirement) => filters.requirementFilter[requirement]);

    let query = {};

    query.subscriptionActive = true;

    // Add city to query if defined
    if (area) {
      let locationArray = area.split(", "); // split the string into an array using ", " as the delimiter
      query["address.city"] = locationArray[locationArray.length === 4 ? 1 : 0];
    }

    if (name) {
      query.name = { $regex: new RegExp(name), $options: "i" };
    }

    // Add selectedKitchens to query if defined
    if (selectedKitchens.length > 0) {
      query.cuisineType = {
        $in: selectedKitchens,
      };
    }

    // Add selectedRequirements to query if defined
    if (selectedRequirements.length > 0) {
      query.specialRequirements = {
        $in: selectedRequirements,
      };
    }

    // calculation of today one year ago to decide whether a restaurant is new or established
    const currentDate = new Date();
    const oneYearAgo = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDate(),
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds()
    );
    // Pagination logic
    const skip = (page - 1) * limit;

    let queryResult;

    if (type === "old") {
      query = {
        $and: [query, { createdAt: { $lte: oneYearAgo } }],
      };
    } else {
      query = {
        $and: [query, { createdAt: { $gt: oneYearAgo } }],
      };
    }

    if (sorting === "distance") {
      // get coordinates of user location
      const userLocation = await getCoordinates(req.query.area);

      const userCoordinates = [
        parseFloat(userLocation.lng),
        parseFloat(userLocation.lat),
      ];

      const aggregation = [
        {
          $geoNear: {
            near: { type: "Point", coordinates: userCoordinates },
            distanceField: "distance",
            query: query, // Include the filters in the $geoNear stage
            spherical: true,
          },
        },
      ];
      queryResult = await RestaurantModel.aggregate(aggregation);
    } else {
      switch (sorting) {
        case "newest":
          queryResult = await RestaurantModel.find(query)
            .sort("-openingDate")
            .skip(skip)
            .limit(Number(limit))
            .exec();
          break;
        default:
          queryResult = await RestaurantModel.find(query)
            .sort("-averageRating")
            .skip(skip)
            .limit(Number(limit))
            .exec();
          break;
      }
    }
    res.status(200).send(queryResult);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(e);
  }
};

const createRestaurant = async (req, res) => {
  try {
    const restaurantData = req.body;

    // Manually populate location field for geospatial indexing
    restaurantData.location = {
      type: "Point",
      coordinates: [
        restaurantData.address.longitude,
        restaurantData.address.latitude,
      ],
    };

    const newRestaurant = new RestaurantModel(restaurantData);

    const restaurantId = newRestaurant._id;
    await newRestaurant.save();
    res.status(201).json({ restaurantId: restaurantId });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Failed to create restaurant" });
  }
};

const clickRestaurant = async (req, res) => {
  const restaurantId = req.body.restaurantId;

  if (!restaurantId) {
    return res.status(400).json({ error: "No restaurant ID provided" });
  }
  try {
    const restaurant = await RestaurantModel.findOneAndUpdate(
      { _id: restaurantId },
      { $inc: { numberOfClicksThisMonth: 1 } },
      { new: true } // return the updated document
    );

    // If restaurant is null, that means it wasn't found
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // update number of clicks in stripe for billing the pay-per-click fee every month
    const subscription = await stripe.subscriptions.retrieve(
      //get subscription of current restaurant
      restaurant.subscriptionStripeId
    );
    // get specific subscription item id of pay-per-click subscription
    const subscriptionItemId = subscription.items.data[1].id;

    await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
      quantity: 1,
      action: "increment",
    });

    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateRestaurant = async (req, res) => {
  // Validation and permission already conducted by permission middleware

  try {
    const restaurantData = req.body;
    delete restaurantData.restaurantId;
    delete restaurantData.openingDate;
    const updatedRestaurant = await RestaurantModel.updateOne(
      { _id: req.restaurant._id },
      restaurantData,
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).send(updatedRestaurant);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const uploadImages = async (req, res) => {
  // Validation and permission already conducted by permission middleware

  try {
    // 1) If any, delete all existing files
    await req.restaurant.images.forEach((image) => {
      // The image's public ID is needed to delete the image from cloudinary
      // The cloudinary public ID is stored between the last "/" and ".jpg" inside the URL
      // Instead of storing the public ID in our data model, we can just extract it from the URL
      const publicId = image
        .split("/")
        .pop()
        .substring(0, image.lastIndexOf("."));
      cloudinary.uploader.destroy(publicId);
    });

    // 2) Upload new files

    // Loop over all uploaded images
    const images = req.files;
    const imageURLs = await Promise.all(
      images.map(async (image) => {
        const resCloudinary = await cloudinary.uploader.upload(image.path);
        return resCloudinary.secure_url;
      })
    );
    // Add URLs as a reference to the restaurant owner
    await RestaurantModel.findOneAndUpdate(
      { _id: req.body.restaurantId },
      { images: imageURLs }
    );
    res.status(201).json({ message: "Images uploaded successfully" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Failed to upload images" });
  } finally {
    // Delete all uploaded files
    await clearUploadDirectory(req.files);
  }
};

const uploadMenu = async (req, res) => {
  // Validation and permission already conducted by permission middleware

  try {
    // 1) Delete existing menu
    if (req.restaurant.menuURL) {
      // The file's public ID is needed to delete the image from cloudinary
      // The cloudinary public ID is stored between the last "/" and ".pdf" inside the URL
      // Instead of storing the public ID in our data model, we can just extract it from the URL
      const publicId = req.restaurant.menuURL
        .split("/")
        .pop()
        .substring(0, req.restaurant.menuURL.lastIndexOf("."));

      await cloudinary.uploader.destroy(publicId);
    }

    // Upload to cloudinary
    const menu = req.file;
    const resCloudinary = await cloudinary.uploader.upload(menu.path);

    // Generate URLs
    const menuURL = resCloudinary.secure_url;
    await RestaurantModel.findOneAndUpdate(
      { _id: req.body.restaurantId },
      { menuURL: menuURL }
    );
    res.status(201).json({ message: "Menu uploaded successfully" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Failed to upload menu" });
  } finally {
    // Delete all uploaded files
    await clearUploadDirectory([req.file]);
  }
};

const clearUploadDirectory = async (files) => {
  const directory = "./uploads";
  try {
    const unlinkPromises = files.map((file) => {
      return fs.unlink(path.join(directory, file.filename));
    });
    await Promise.all(unlinkPromises);
  } catch (err) {
    console.error(`Error deleting uploaded files: ${err}`);
  }
};

const activateRestaurant = async (req, res) => {
  try {
    const sessionId = req.body.sessionId;
    if (!sessionId) {
      res.status(400).json({ error: "No checkout session ID provided" });
    }
    const restaurantId = req.body.restaurantId;
    if (!restaurantId) {
      res.status(400).json({ error: "No restaurant ID provided" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      res
        .status(400)
        .json({ error: "No checkout session with given session ID" });
    }
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );

    if (
      subscription.status !== "active" ||
      session.metadata.restaurantId !== restaurantId
    ) {
      return res.status(401).json({ error: "Activation not allowed" });
    }

    // create only a subscription schedule if there exists none yet
    if (subscription.schedule === null) {
      // create a subscription schedule from the subscription in stripe, so that after one year the subscription of the restaurant changes automatically into the subscription for the established restaurants e.g. only pay-per-click
      const subscriptionSchedule = await stripe.subscriptionSchedules.create({
        from_subscription: subscription.id,
      });

      await stripe.subscriptionSchedules.update(subscriptionSchedule.id, {
        phases: [
          {
            items: [
              { price: "price_1NJzvrIHnXNDucDdgXDComqj", quantity: 1 }, // subscription fee
              { price: "price_1NJzvrIHnXNDucDdNm2Ejxb9" }, // pay-per-click
            ],
            start_date: subscription.start_date,
            iterations: 12, // after 12 months the subscription for the new restaurants is released and only the pay-per-click fee remains
          },
          {
            items: [{ price: "price_1NJzvrIHnXNDucDdNm2Ejxb9" }], // pay-per-click
            // the pay-per-click subscription is open end
          },
        ],
      });
    }
    //activate subscription and save stripe subscription ID
    const result = await RestaurantModel.updateOne(
      { _id: restaurantId },
      {
        $set: {
          subscriptionActive: true,
          subscriptionStripeId: subscription.id,
        },
      }
    );
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (result.modifiedCount === 1 || restaurant.subscriptionActive) {
      generateReviewCodes(restaurantId, 5, true);
      res.status(200).send(result);
    } else {
      res
        .status(404)
        .json({ error: "Restaurant not found or could not be activated" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Failed to activate subscription" });
  }
};

const checkToDelete = async (req, res) => {
  try {
    const sessionId = req.body.sessionId;
    if (!sessionId) {
      res.status(400).json({ error: "No checkout session ID provided" });
    }
    const restaurantId = req.body.restaurantId;
    if (!restaurantId) {
      res.status(400).json({ error: "No restaurant ID provided" });
    }
    const restaurant = await RestaurantModel.findById(restaurantId);

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentStatus = session.payment_status;
    const subscription = session.subscription;

    // check whether there was a subscription created during this checkout session
    // if not, delete restaurant because payment checkout was cancelled

    if (
      paymentStatus === "unpaid" &&
      subscription === null &&
      session.metadata.restaurantId === restaurantId
    ) {
      const result = await RestaurantModel.deleteOne({ _id: restaurantId });
      if (result.deletedCount !== 1) {
        return res.status(404).json({
          error: "Restaurant not found or could not be deleted",
        });
      }
      if (!restaurant.owner) {
        return res.status(404).json({
          error: "Owner does not exist",
        });
      }
      const ownerId = restaurant.owner;
      const ownerExists = await UserModel.exists({ _id: ownerId });

      if (!ownerExists) {
        return res.status(404).json({ error: "Owner not found" });
      }

      await UserModel.findByIdAndDelete(ownerId);

      res.status(200).json({ message: "Owner deleted" });
    } else {
      res
        .status(200)
        .json({ error: "There is a subscription for this restaurant" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Failed to delete restaurant and user" });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.body.restaurantId;
    if (!restaurantId) {
      return res.status(400).json({ error: "No restaurant ID provided" });
    }

    const restaurant = await RestaurantModel.findById(restaurantId);

    //Cancel subscription
    await stripe.subscriptions.cancel(restaurant.subscriptionStripeId);

    // Delete all dependencies
    await ReviewverificationModel.deleteMany({ restaurant: restaurantId });
    await ReviewModel.deleteMany({ restaurant: restaurantId });
    await BlogpostModel.deleteMany({ restaurantId: restaurantId });
    await VoucherModel.deleteMany({ restaurant: restaurantId });
    await FavoriteModel.updateMany(
      { restaurants: restaurantId },
      { $pull: { restaurants: restaurantId } }
    );

    const result = await RestaurantModel.deleteOne({ _id: restaurantId });

    // Owner will now be free visitor
    await UserModel.updateOne({ _id: req.user._id }, { role: "FREE" });

    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Export
module.exports = {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  clickRestaurant,
  uploadImages,
  uploadMenu,
  checkToDelete,
  activateRestaurant,
  deleteRestaurant,
  getLocationAutocomplete,
  getAutocompleteRestaurantName,
};
