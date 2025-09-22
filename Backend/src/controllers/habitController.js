const { calculateStreak } = require("../helpers/habitHelper");
const HabitModel = require("../models/habitModel");

// Create habit
const createHabit = async (req, res) => {
  try {
    const { name, frequency, target, reminderTime } = req.body;
    if (!name)
      return res.status(400).json({ message: "Habit name is required" });

    const habit = new HabitModel({
      user: req.user.userId,
      name,
      frequency,
      target,
      reminderTime,
    });

    await habit.save();
    res.status(201).json({ message: "Habit created", habit });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

// Get all habits with streak info
const getHabits = async (req, res) => {
  try {
    const habits = await HabitModel.find({ user: req.user.userId });

    const withStreaks = habits.map((h) => ({
      ...h.toObject(),
      streak: calculateStreak(h),
    }));

    res.json(withStreaks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

// Mark habit as done (log today)
const markHabit = async (req, res) => {
  try {
    const habit = await HabitModel.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const today = new Date().toDateString();
    const alreadyLogged = habit.completedDates.some(
      (d) => new Date(d).toDateString() === today
    );

    if (!alreadyLogged) {
      habit.completedDates.push(new Date());
      await habit.save();
    }

    res.json({
      message: "Habit marked done",
      habit,
      streak: calculateStreak(habit),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

// Delete habit
const deleteHabit = async (req, res) => {
  try {
    const deleted = await HabitModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!deleted) return res.status(404).json({ message: "Habit not found" });

    res.json({ message: "Habit deleted", habit: deleted });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

module.exports = { createHabit, getHabits, markHabit, deleteHabit };
