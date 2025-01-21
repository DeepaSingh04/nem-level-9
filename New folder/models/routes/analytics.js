const express = require("express");
const User = require("../models/user");
const Course = require("../models/course");

const router = express.Router();


router.get("/user-engagement", async (req, res) => {
  const { limit = 10, skip = 0 } = req.query; // Pagination parameters
  
  try {
    const result = await User.aggregate([
      { $unwind: "$preferences" }, // Unwind preferences array
      { $group: { _id: "$preferences", totalPreferences: { $sum: 1 } } }, // Group by preference
      { $project: { _id: 0, preference: "$_id", totalPreferences: 1 } }, // Project fields
      { $sort: { totalPreferences: -1 } }, // Sort by preference count
      { $skip: parseInt(skip) }, // Skip for pagination
      { $limit: parseInt(limit) }, // Limit for pagination
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/summary", async (req, res) => {
  const { limit = 10, skip = 0 } = req.query; // Pagination parameters

  try {
    // Aggregate User Insights
    const userInsights = await User.aggregate([
      { $group: { _id: "$role", userCount: { $sum: 1 }, totalPreferences: { $avg: { $size: "$preferences" } } } },
      { $project: { role: "$_id", userCount: 1, totalPreferences: 1 } },
      { $sort: { userCount: -1 } },
    ]);

    // Aggregate Course Insights
    const courseInsights = await Course.aggregate([
      { $match: { active: true } },
      { $group: { _id: "$category", avgEnrollment: { $avg: "$enrollmentCount" }, maxEnrollment: { $max: "$enrollmentCount" }, minEnrollment: { $min: "$enrollmentCount" } } },
      { $sort: { avgEnrollment: -1 } },
    ]);

    res.json({
      userInsights,
      courseInsights,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/custom-report", async (req, res) => {
  const { filters, groupBy, sortBy, limit = 10, skip = 0 } = req.body; // Custom filters, grouping, sorting

  try {
    let matchStage = {};
    if (filters) matchStage = { $match: filters };

    const result = await Course.aggregate([
      matchStage,
      { $group: { _id: groupBy, total: { $sum: 1 }, avgEnrollment: { $avg: "$enrollmentCount" } } },
      { $sort: { [sortBy]: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/movie-stats", async (req, res) => {
  const { releaseYear = 2000 } = req.query; // Filter by release year

  try {
    const result = await Movie.aggregate([
      { $match: { releaseYear: { $gte: parseInt(releaseYear) } } },
      { $group: { _id: "$genre", movieCount: { $sum: 1 } } },
      { $sort: { movieCount: -1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/popular-courses", async (req, res) => {
  const { limit = 5 } = req.query; // Top 5 courses

  try {
    const result = await Course.aggregate([
      { $match: { enrollmentCount: { $gt: 0 }, active: true } }, // Filter active courses with enrollments
      { $sort: { enrollmentCount: -1 } }, // Sort by enrollment count
      { $limit: parseInt(limit) }, // Limit to top 5
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/user-activity", async (req, res) => {
  const { months = 6, limit = 10 } = req.query; 

  try {
    const result = await User.aggregate([
      { $match: { registrationDate: { $gte: new Date(new Date() - months * 30 * 24 * 60 * 60 * 1000) } } }, // Match users in last 'months'
      { $group: { _id: { $month: "$registrationDate" }, activeUserCount: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      { $limit: parseInt(limit) },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
