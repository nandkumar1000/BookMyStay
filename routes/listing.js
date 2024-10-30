const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require("../schema.js");
const ExpressError = require('../utils/ExpressError.js');
const Listing = require("../model/Listing");

// Middleware for validating listings using Joi
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(400, errmsg)); // Use return to stop execution
  } else {
    next();
  }
};

// Index Route - Show all listings
router.get('/', wrapAsync(async (req, res) => {
  console.log('Fetching all listings...');
  const alllisting = await Listing.find({});
  res.render("listings/index", { alllisting });
}));

// New Route - Form to create a new listing
router.get('/new', wrapAsync((req, res) => {
  res.render("listings/new");
}));

// POST route to create a new listing
router.post('/', wrapAsync(async (req, res) => {
  try {
    // Assuming you have a Listing model to interact with the database
    const newListing = await Listing.create(req.body.listing);
    res.status(201).redirect('/listings'); // Redirect to the listings page after successful creation
  } catch (error) {
    console.error(error);
    res.status(500).render("listings/new", { error: "Failed to create listing" }); // Render form with error message
  }
}));


// Show Route - Display a specific listing
router.get('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    req.flash("error", "Listing you  requested for  does not exit!");
    res.redirect("/listings");
  }
  res.render("listings/show", { listing });
}));

// Create Route - Create a new listing
router.post('/', validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.Listing);
  await newListing.save();
  req.flash("succes", "New listing is created");
  res.redirect("/listings");
}));

// Edit Route - Form to edit a listing
router.get('/:id/edit', wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you  requested for  does not exit!");
    res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
}));

// Update Route - Update a listing
router.put('/:id', validateListing, wrapAsync(async (req, res, next) => {
  const { id } = req.params;

  // Log incoming data for debugging
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
  if (!listing) {
    return next(new ExpressError(404, "Listing not found"));
  }

  // Log the updated listing
  const updatedListing = await Listing.findById(id);
  console.log("Updated Listing:", updatedListing);
  req.flash("succes", "Listings updated!");
  res.redirect(`/listings/${id}`);
}));


// Delete Route - Delete a listing
router.delete('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("succes", "listing is Deleted");
  res.redirect('/listings');
}));

module.exports = router;
