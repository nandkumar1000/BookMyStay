const express = require('express');
const path = require('path');
const app = express();
const mongooseConnection = require('./config/mongoose.js')

// Import schema validation for server-side validation
const { listingSchema, reviewSchema } = require("./schema.js");

// Require wrapAsync for handling errors
const wrapAsync = require('./utils/wrapAsync.js');
// Require custom error handling class
const ExpressError = require('./utils/ExpressError.js');

// Importing models
const Listing = require("./model/Listing");
const Reviews = require("./model/Review.js");

// Templating engine
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// Port configuration
const port = 8080;

// Middleware for PUT operations
const methodOverride = require('method-override');
app.use(methodOverride("_method"));

// Middleware
app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, "/views"));

// Middleware for serving static files
app.use(express.static(path.join(__dirname, "/public")));

// URL encoding and JSON parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie parser middleware
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Import routes
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

// Using routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
// home route


// Handle 404 errors
app.use("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render("listings/error", { message });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
