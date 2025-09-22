const mongoose = require("mongoose");

const sleepSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  hoursSlept: { type: Number, required: true, min: 0 },
  sleepQuality: {
    type: String,
    enum: ["very_poor", "poor", "fair", "good", "very_good"],
    default: "fair",
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

sleepSchema.index({ user: 1, date: -1 });

const SleepModel = mongoose.model("Sleep", sleepSchema);

module.exports = SleepModel;
