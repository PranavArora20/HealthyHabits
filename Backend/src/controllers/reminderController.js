const ReminderModel = require("../models/reminderModel");

const createReminder = async (req, res) => {
  try {
    const { title, type, time, daysOfWeek, enabled, meta } = req.body;
    if (!title || !time) return res.status(400).json({ message: "title and time are required" });
    const reminder = await ReminderModel.create({
      user: req.user.userId,
      title,
      type,
      time,
      daysOfWeek,
      enabled,
      meta,
    });
    return res.status(201).json(reminder);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getReminders = async (req, res) => {
  try {
    const reminders = await ReminderModel.find({ user: req.user.userId }).sort({ createdAt: -1 });
    return res.json(reminders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateReminder = async (req, res) => {
  try {
    const updated = await ReminderModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const deleted = await ReminderModel.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createReminder, getReminders, updateReminder, deleteReminder };
