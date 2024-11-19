const express = require("express");
const router = express.Router({ mergeParams: true }); // Ensures parent route parameters are accessible
const wrapAsync = require("../utils/wrapAsync"); // Handles async errors
const ExpressError = require("../utils/ExpressError"); // Custom error handling class
const { listingSchema, reviewSchema } = require("../schema"); // Joi schemas for server-side validation
const Review = require("../model/Review"); // Review model
const Listing = require("../model/Listing"); // Listing model
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware"); // Middleware functions
const reviewController = require("../controllers/review"); // Controller for review routes

// Route to create a review
router.post(
  "/",
  isLoggedIn, // Middleware to check if the user is logged in
  validateReview, // Middleware to validate review data using Joi
  wrapAsync(reviewController.createReview) // Controller to handle review creation
);

// Route to delete a review
router.delete(
  "/:reviewId",
  isLoggedIn, // Middleware to check if the user is logged in
  isReviewAuthor, // Middleware to check if the user is the author of the review
  wrapAsync(reviewController.destroyReview) // Controller to handle review deletion
);

module.exports = router;
