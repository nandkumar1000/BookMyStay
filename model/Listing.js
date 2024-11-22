const mongoose = require('mongoose');
const Review = require('./Review.js'); // Assuming Review model is correctly set up
const { string } = require('joi');

// Schema for Listing
const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    url: string,
    filename: string,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [ // Pluralized the field name for consistency
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Post middleware for findOneAndDelete using ListingSchema
ListingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    try {
      await Review.deleteMany({ _id: { $in: listing.reviews } }); // Pluralized the field name
    } catch (err) {
      console.error("Error deleting associated reviews:", err);
    }
  }
});

module.exports = mongoose.model('Listing', ListingSchema);
