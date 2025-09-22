const ActivityModel = require("../models/activityModel");

// Import helper
const { getUserActivitySummary } = require("../helpers/activityHelper");

// Create an activity
const createActivity = async (req, res) => {
  const { type, duration, caloriesBurned } = req.body;
  try {
    if (!type || !duration) {
      return res
        .status(400)
        .json({ message: "Type and duration are required" });
    }

    const activity = new ActivityModel({
      user: req.user.userId,
      type,
      duration,
      caloriesBurned,
    });

    await activity.save();

    // ✅ Call helper right after saving
    const summary = await getUserActivitySummary(req.user.userId);

    res.status(201).json({
      message: "Activity logged",
      activity,
      summary, //  now frontend gets updated stats instantly
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

// Get all activities
const getActivities = async (req, res) => {
  try {
    const activities = await ActivityModel.find({ user: req.user.userId }).sort(
      { createdAt: -1 }
    );
    res.json(activities);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went Wrong", error: err.message });
  }
};

// Update an activity
const updateActivity = async (req, res) => {
  try {
    const updated = await ActivityModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Activity Not Found" });
    }
    res.json({ message: "Activity updated", updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went Wrong", error: err.message });
  }
};

// Delete an activty
const deleteActivity = async (req, res) => {
  try {
    const deleted = await ActivityModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Activity Not Found" });
    }
    res.json({ message: "Activity Deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went Wrong", error: err.message });
  }
};

module.exports = {
  createActivity,
  getActivities,
  updateActivity,
  deleteActivity,
};
