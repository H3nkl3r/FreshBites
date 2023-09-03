const BlogpostModel = require("../models/Blogpost");
const { v2: cloudinary } = require("cloudinary");
const { promises: fs } = require("fs");
const { clearUploadDirectory } = require("../utils/fileManagement");
const RestaurantModel = require("../models/Restaurant");

//  Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// get all blogposts by type
const getBlogposts = async (req, res) => {
  try {
    const type = req.query.type;
    const area = req.query.area;

    if (!type) {
      return res.status(400).json({ error: "No type provided" });
    }

    // Initialize the query with the type.
    let query = { type: type };

    if (area) {
      let locationArray = area.split(", "); // split the string into an array using ", " as the delimiter
      const city = locationArray[locationArray.length === 4 ? 1 : 0];

      // First find the restaurants in the city
      const restaurantsInCity = await RestaurantModel.find({
        "address.city": city,
      }).lean();

      // Now get the ids of these restaurants
      const restaurantIds = restaurantsInCity.map(
        (restaurant) => restaurant._id
      );

      // Modify the query to include the restaurantIds
      query.restaurantId = { $in: restaurantIds };
    }

    const result = await BlogpostModel.find(query)
      .populate("restaurantId", "name")
      .sort("-createdAt")
      .exec();

    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to get blogposts" });
  }
};


const getBlogpostById = async (req, res) => {
  try {
    const { blogpostId } = req.query;
    if (!blogpostId) {
      return res.status(400).json({ error: "No blogpost ID provided" });
    }
    const blogpost = await BlogpostModel.findById(blogpostId).exec();
    res.status(200).send(blogpost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get blogpost" });
  }
};

const getBlogpostByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    if (!restaurantId) {
      return res.status(400).json({ error: "no restaurant ID provided" });
    }
    const blogpost = await BlogpostModel.findOne({
      restaurantId: restaurantId,
    });
    res.status(200).json({ blog: blogpost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get blogpost" });
  }
};

const createBlogpost = async (req, res) => {
  try {
    const { title, text, restaurantId } = req.body;
    if (!title || !text || !restaurantId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const blogpostAlreadyExists = await BlogpostModel.findOne({
      restaurantId: restaurantId,
    });
    if (blogpostAlreadyExists) {
      return res
        .status(409)
        .json({ error: "There already exists a blogpost for this restaurant" });
    }

    const newBlogpost = new BlogpostModel(req.body);
    const blogpostId = newBlogpost._id;
    await newBlogpost.save();
    res.status(201).json({ blogpostId: blogpostId });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Failed to create blogpost" });
  }
};

const uploadImage = async (req, res) => {
  try {
    const image = req.file;
    const resCloudinary = await cloudinary.uploader.upload(image.path);
    const imageURL = resCloudinary.secure_url;
    await BlogpostModel.findOneAndUpdate(
      { _id: req.body.blogpostId },
      { image: imageURL }
    );
    res.status(201).json({ message: "Image uploaded successfully" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Failed to upload image" });
  } finally {
    // Clear the entire upload directory
    await clearUploadDirectory([req.file]);
  }
};

const deleteBlogpost = async (req, res) => {
  try {
    const blogpostId = req.body.blogpostId;
    if (!blogpostId) {
      return res.status(400).json({ error: "No blogpost ID provided" });
    }

    const blogpostExists = await BlogpostModel.exists({ _id: blogpostId });

    if (!blogpostExists) {
      return res.status(404).json({ error: "Blogpost not found" });
    }

    await BlogpostModel.findByIdAndDelete(blogpostId);

    res.status(200).json({ message: "Blogpost deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Export functions
module.exports = {
  getBlogposts,
  getBlogpostById,
  createBlogpost,
  uploadImage,
  deleteBlogpost,
  getBlogpostByRestaurant,
};
