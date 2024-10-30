const express = require('express');
const path = require('path');
const app = express();
const mongooseConnection = require('./config/mongoose.js')
const { cookie } = require('express-validator');
// express session
const session = require('express-session');
// connect-flash
const flash = require('connect-flash');

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

// using express-session
const sessionOption = {
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 *
      7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
}
app.use(session(sessionOption));
// using flash
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


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
