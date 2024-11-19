const mongoose = require('mongoose');
const Review = require('./Review.js'); // Assuming Review model is correctly set up

// Schema for Listing
const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage"
    },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1454388683759-ee76c15fee26?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG90ZWxzfGVufDB8fDB8fHww",
      set: (v) => v === "" ? "https://images.unsplash.com/photo-1454388683759-ee76c15fee26?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG90ZWxzfGVufDB8fDB8fHww" : v
    }
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
