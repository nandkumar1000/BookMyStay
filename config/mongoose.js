// const mongoose = require('mongoose');
// // Sample data
const initialdata = require("./data.js");

// // Listing model
const Listing = require("../model/Listing.js");

// // MongoDB connection URL
// const mongo_url = "mongodb://localhost:27017/wonderlust"; // Fixed URL

// // Main function to connect to the database and insert data
// async function main() {
//   try {
//     // Connect to the MongoDB database with connection options
//     await mongoose.connect(mongo_url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to the database");

//     // Uncomment this block to delete previous data and insert new data
//     await config(); // Uncomment after confirming connection
//   } catch (err) {
//     console.error("Database connection error:", err.message); // Log error message
//   }
// }



// // Execute the main function
// main();



// ALTERNATIVE CONNECTION  OF DATABASE
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/BookMyStay')

const db = mongoose.connection

db.on('err', err => {
  console.log(err);
})

db.on('open', () => {
  console.log('Connected to database.');
})
// Function to delete previous data and insert new data
// const config = async () => {
//   try {
//     // Delete all existing listings
//     await Listing.deleteMany({});
//     console.log("Previous data deleted");

//     // Insert new initial data
//     await Listing.insertMany(initialdata.data);
//     console.log("Data inserted successfully");

//     // Exit the process after successful insertion
//     process.exit(0);
//   } catch (error) {
//     console.error("Error during data configuration:", error.message); // Log error message
//     process.exit(1);
//   }
// };
// config();