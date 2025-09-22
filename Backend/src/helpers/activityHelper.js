const ActivityModel = require("../models/activityModel");
const mongoose = require("mongoose");

const getUserActivitySummary = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(String(userId));
  const summary = await ActivityModel.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: null,
        totalDuration: { $sum: "$duration" },
        totalCalories: { $sum: "$caloriesBurned" },
        activityCount: { $sum: 1 },
      },
    },
  ]);

  return summary.length
    ? summary[0]
    : { totalDuration: 0, totalCalories: 0, activityCount: 0 };
};

module.exports = { getUserActivitySummary };
