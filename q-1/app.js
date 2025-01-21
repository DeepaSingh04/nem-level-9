const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Route Imports
const analyticsRoutes = require("./routes/analytics");

const app = express();
app.use(bodyParser.json());


mongoose
  .connect("mongodb://127.0.0.1:27017/lms", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/analytics", analyticsRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
