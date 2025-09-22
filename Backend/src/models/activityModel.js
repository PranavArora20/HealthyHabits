const mongoose = require("mongoose");

// activities like running,cycling,sleep
const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  duration: { type: Number }, // optional mainly for workouts
  caloriesBurned: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const ActivityModel = mongoose.model("Activity", activitySchema);

module.exports = ActivityModel;
