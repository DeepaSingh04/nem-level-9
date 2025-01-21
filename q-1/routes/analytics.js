const express = require("express");
const User = require("../models/user");
const Course = require("../models/course");

const router = express.Router();


router.get("/user-role-count", async (req, res) => {
  try {
    const result = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/course-category-count", async (req, res) => {
  try {
    const result = await Course.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
