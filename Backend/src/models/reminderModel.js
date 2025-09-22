const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["workout", "meal", "water", "sleep", "habit", "custom"],
      default: "custom",
    },
    time: { type: String, required: true }, // e.g., "08:30"
    daysOfWeek: {
      type: [Number],
      default: [0, 1, 2, 3, 4, 5, 6], // 0=Sun ... 6=Sat
    },
    enabled: { type: Boolean, default: true },
    meta: { type: Object },
  },
  { timestamps: true }
);

const ReminderModel = mongoose.model("Reminder", reminderSchema);
module.exports = ReminderModel;
