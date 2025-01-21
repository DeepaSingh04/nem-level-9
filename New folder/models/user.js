const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String, 
  preferredLanguage: String, 
  preferences: [String], 
  registrationDate: Date, 
  active: Boolean, 
});

module.exports = mongoose.model("User", userSchema);
