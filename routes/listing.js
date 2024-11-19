const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../model/Listing");
const { authenticate } = require("passport");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js")



// Index Route - Show all listings
router.get('/', wrapAsync(listingController.index));

// New Route - Form to create a new listing
router.get('/new', isLoggedIn, listingController.renderNewForm);

// POST route to create a new listing
router.post('/', isLoggedIn, wrapAsync(async (req, res) => {
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
router.get('/:id', wrapAsync(listingController.showListing));

// Create Route - Create a new listing
router.post('/', isLoggedIn, validateListing, wrapAsync(listingController.createLisiting));

// Edit Route - Form to edit a listing
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update Route - Update a listing
router.put('/:id', isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));


// Delete Route - Delete a listing
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.destroyListings));

module.exports = router;
