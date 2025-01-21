const express = require("express");
const User = require("../models/user");
const Course = require("../models/course");

const router = express.Router();


router.get("/user-language-preferences", async (req, res) => {
  try {
    const result = await User.aggregate([
      { $group: { _id: "$preferredLanguage", userCount: { $sum: 1 } } }, 
      { $sort: { userCount: -1 } }, 
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/course-enrollment-stats", async (req, res) => {
  try {
    const result = await Course.aggregate([
      { $match: { enrollmentCount: { $gt: 0 } } }, /
      { $sort: { enrollmentCount: -1 } }, 
      { $limit: 3 }, 
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/course-duration-categories", async (req, res) => {
  try {
    const result = await Course.aggregate([
      {
        $addFields: {
          durationCategory: {
            $switch: {
              branches: [
                { case: { $lte: ["$duration", 5] }, then: "short" }, // Duration <= 5 hours
                { case: { $and: [{ $gt: ["$duration", 5] }, { $lte: ["$duration", 15] }] }, then: "medium" }, // Duration > 5 and <= 15
                { case: { $gt: ["$duration", 15] }, then: "long" }, // Duration > 15 hours
              ],
              default: "unknown", // Default category
            },
          },
        },
      },
      { $group: { _id: "$durationCategory", courseCount: { $sum: 1 } } }, 
      { $sort: { courseCount: -1 } }, 
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
