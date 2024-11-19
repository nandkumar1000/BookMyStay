const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// WE ARE using passport local mongoose plugin
const passportLocalMongoose = require('passport-local-mongoose');

// defining userSchema
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});
// adding plugin to userSchema
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", "userSchema")
