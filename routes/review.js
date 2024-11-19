const express = require("express");
const router = express.Router({ mergeParams: true });
// Require wrapAsync for handling errors
const wrapAsync = require('../utils/wrapAsync.js');
// Require our custom error handling class
const ExpressError = require('../utils/ExpressError.js');
// Joi for schema validation in server-side validation
const { listingSchema, reviewSchema } = require("../schema.js");
// Review and Listing models
const Review = require("../model/Review.js");
const Listing = require("../model/Listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")


// Create REVIEW POST ROUTE
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  const { id } = req.params; // Assuming id is the listing ID
  const review = new Review(req.body.review); // Ensure req.body.review matches your input structure
  new Review.author = req.user._id;
  listing.review.push(newReview);

  await review.save(); // Save the review

  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  listing.reviews.push(review._id); // Associate the review with the listing
  await listing.save(); // Save the listing after adding the review
  req.flash("succes", "New Review is created");
  res.redirect(`/listings/${id}`); // Redirect after saving
}));

// Delete review route
router.delete("/:reviewId", isLoggedIn, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params; // id is the listing ID, reviewId is the review ID

  const listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  await Review.findByIdAndDelete(reviewId);
  req.flash("succes", "New Review is Deleted!");
  res.redirect(`/listings/${id}`); // Redirect after deletion
}));

module.exports = router;
