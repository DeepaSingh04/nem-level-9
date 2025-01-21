const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  category: String, 
  description: String,
  enrollmentCount: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  active: { type: Boolean, default: true }, 
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Course", courseSchema);
