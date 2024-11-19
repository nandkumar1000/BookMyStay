const Listing = require("../models/listing");
const review = require("../models/review");

module.exports.createReview = async (req, res) => {
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
}

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params; // id is the listing ID, reviewId is the review ID

  const listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  await Review.findByIdAndDelete(reviewId);
  req.flash("succes", "New Review is Deleted!");
  res.redirect(`/listings/${id}`); // Redirect after deletion
}