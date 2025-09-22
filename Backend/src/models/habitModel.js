const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // e.g. "Drink Water"
    frequency: { type: String, enum: ["daily", "weekly"], default: "daily" },
    target: { type: Number, default: 1 }, // e.g. "8 glasses"
    completedDates: [Date], // store check-ins
    reminderTime: { type: String }, // optional, "08:00"
  },
  { timestamps: true }
);

const HabitModel = mongoose.model("Habit", habitSchema);
module.exports = HabitModel;
