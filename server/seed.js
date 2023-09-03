const mongoose = require("mongoose");
require("dotenv").config();
const RestaurantModel = require("./models/Restaurant");
const VerificationModel = require("./models/Reviewverification");
const BlogpostModel = require("./models/Blogpost");

const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const cluster = process.env.DB_CLUSTER;

// Database
// Define your own (!) DB credentials (DB_USERNAME and DB_PASSWORD) in a local .env file
mongoose
  .connect(
    `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the application if unable to connect to the database
  });

const deleteRestaurants = async () => {
  try {
    await RestaurantModel.deleteMany({});
  } catch (e) {
    console.log(e);
  }
};

const deleteVerifications = async () => {
  try {
    await VerificationModel.deleteMany({});
  } catch (e) {
    console.log(e);
  }
};

const deleteBlogposts = async () => {
  try {
    await BlogpostModel.deleteMany({});
  } catch (e) {
    console.log(e);
  }
};

const generateRestaurants = async () => {
  try {
    for (let i = 0; i < 20; i++) {
      const newRestaurant = new RestaurantModel({
        name: faker.company.name(),
        phone: faker.phone.number(),
        website: faker.internet.url(),
        cuisineType: [
          faker.word.sample(),
          faker.word.sample(),
          faker.word.sample(),
        ],
        menuURL: faker.internet.url(),
        address: {
          street: faker.location.street(),
          zip: faker.location.zipCode(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
        },
        images: [
          {
            id: faker.string.uuid(),
            url: faker.image.url(),
            name: faker.word.sample(),
          },
          {
            id: faker.string.uuid(),
            url: faker.image.url(),
            name: faker.word.sample(),
          },
          {
            id: faker.string.uuid(),
            url: faker.image.url(),
            name: faker.word.sample(),
          },
          {
            id: faker.string.uuid(),
            url: faker.image.url(),
            name: faker.word.sample(),
          },
          {
            id: faker.string.uuid(),
            url: faker.image.url(),
            name: faker.word.sample(),
          },
        ],
        openingHours: [
          faker.date.weekday(),
          faker.date.weekday(),
          faker.date.weekday(),
        ],
        specialRequirements: [
          faker.word.sample(),
          faker.word.sample(),
          faker.word.sample(),
        ],
        email: faker.internet.email(),
        numberOfClicksThisMonth: faker.number.int(100),
        openingDate: faker.date.past(),
        description: faker.lorem.paragraph(),
      });
      await newRestaurant.save();
    }
  } catch (e) {
    console.log(e);
  }
};

const generateBlogposts = async () => {
  try {
    const restaurants = await RestaurantModel.find({}).exec();
    for (let i = 0; i < 20; i++) {
      const newBlogpost = new BlogpostModel({
        title: faker.lorem.sentence(),
        text: faker.lorem.paragraph(),
        thumbnail: {
          id: faker.string.uuid(),
          url: faker.image.url(),
          name: faker.word.sample(),
        },
        type: faker.helpers.arrayElement(["blog", "successStory"]),
        associatedRestaurant: faker.helpers.arrayElement(restaurants)._id,
      });
      await newBlogpost.save();
    }
  } catch (e) {
    console.log(e);
  }
};

// use valid restaurant object ids
const generateVerificationCodes = async () => {
  try {
    const restaurants = await RestaurantModel.find({}).exec();
    for (let i = 0; i < restaurants.length; i++) {
      const newVerification = new VerificationModel({
        code: faker.number.int(100000, 999999),
        restaurant: restaurants[i]._id,
      });
      await newVerification.save();
    }
  } catch (e) {
    console.log(e);
  }
};

deleteRestaurants()
  .then((r) => console.log("Deleted all restaurants"))
  .then((r) => deleteVerifications())
  .then((r) => console.log("Deleted all verification codes"))
  .then((r) => deleteBlogposts())
  .then((r) => console.log("Delete all Blogposts"));
generateRestaurants()
  .then((r) => console.log("Generated new restaurants"))
  .then((r) => generateVerificationCodes())
  .then((r) => console.log("Generated new verification codes"))
  .then((r) => generateBlogposts())
  .then((r) => console.log("Generated new Blogposts"))
  .then((r) => mongoose.connection.close());
