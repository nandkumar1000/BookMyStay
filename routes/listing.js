const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../model/Listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listing");

const multer = require('multer')
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage })

// Route to get all listings or create a new listing
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single('listings[image]'),
    wrapAsync(listingController.createListing)
  );
// Route to show the form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Routes for a specific listing (CRUD operations)
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // Show a specific listing
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listings[image]'),
    validateListing,
    wrapAsync(listingController.updateListing) // Update a listing
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListings) // Delete a listing
  );
  

// Route to show the form to edit a listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// POST route to create a new listing (Alternative to the main POST route above)
router.post(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    try {
      // Create a new listing using the Listing model
      const newListing = await Listing.create(req.body.listing);
      res.status(201).redirect("/listings"); // Redirect to the listings page
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .render("listings/new", { error: "Failed to create listing" }); // Render form with error message
    }
  })
);

module.exports = router;
