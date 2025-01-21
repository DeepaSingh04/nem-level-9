const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  category: String, 
  description: String,
});

module.exports = mongoose.model("Course", courseSchema);
