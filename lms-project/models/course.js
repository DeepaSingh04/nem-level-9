const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  category: String, // e.g., "technology", "business"
  description: String,
  enrollmentCount: { type: Number, default: 0 }, // Number of students enrolled
  duration: { type: Number, default: 0 }, // Duration in hours
});

module.exports = mongoose.model("Course", courseSchema);
