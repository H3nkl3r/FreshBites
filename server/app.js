const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });
const app = express();
const port = process.env.PORT;
const cors = require("cors");

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

// Middleware
app.use(express.json());

app.use(cors());

const restaurantRouter = require("./routes/restaurantRoutes");
app.use("/restaurant/", restaurantRouter);

const blogpostRouter = require("./routes/blogpostRoutes");
app.use("/blog/", blogpostRouter);

const reviewRouter = require("./routes/reviewRoutes");
app.use("/review/", reviewRouter);

const voucherRouter = require("./routes/voucherRoutes");
app.use("/voucher/", voucherRouter);

const favoriteRouter = require("./routes/favoriteRoutes");
app.use("/favorite/", favoriteRouter);

const userRouter = require("./routes/userRoutes");
app.use("/user/", userRouter);

const paymentRouter = require("./routes/paymentRoutes");
app.use("/payment/", paymentRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
