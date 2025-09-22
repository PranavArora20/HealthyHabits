const ActivityModel = require("../models/activityModel");
const GoalModel = require("../models/goalModel");
const SleepModel = require("../models/sleepModel");

// create Goal
const createGoal = async (req, res) => {
  try {
    const { type, targetValue, deadline } = req.body;
    const goal = await GoalModel.create({
      user: req.user.userId,
      type,
      targetValue,
      deadline,
    });
    res.status(201).json({ message: "Goal Created", goal });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create goal", error: err.message });
  }
};

// get all goals
const getGoals = async (req, res) => {
  try {
    const goals = await GoalModel.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(goals);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch goals", error: err.message });
  }
};

// update progress (achievement tracking)
const updatedGoalProgress = async (req, res) => {
  try {
    const goal = await GoalModel.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!goal) {
      return res.status(404).json({ message: "Goal Not Found" });
    }

    if (goal.type === "calories") {
      const activities = await ActivityModel.find({ user: req.user.userId });
      const totalCalories = activities.reduce(
        (sum, act) => sum + (act.caloriesBurned || 0),
        0
      );
      goal.currentValue = totalCalories;
    } else if (goal.type === "sleep") {
      // sum total hours slept
      const sleeps = await SleepModel.aggregate([
        { $match: { user: goal.user } },
        {
          $group: {
            _id: "$user",
            totalHours: { $sum: "$hoursSlept" },
          },
        },
      ]);
      goal.currentValue = sleeps.length ? sleeps[0].totalHours : 0;
    }

    if (goal.currentValue >= goal.targetValue) {
      goal.achieved = true;
    }
    await goal.save();
    res.json({ message: "Goal progress updated", goal });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update goal Progress", error: err.message });
  }
};

// Delete Goal
const deleteGoal = async (req, res) => {
  try {
    const deleted = await GoalModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Goal Not Found" });
    }
    res.json({ message: "Goal Deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to Delete Goal", error: err.message });
  }
};

module.exports = { createGoal, getGoals, updatedGoalProgress, deleteGoal };
