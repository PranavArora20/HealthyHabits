const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["calories", "sleep", "water", "steps", "custom"],
      required: true,
    },
    targetValue: {
      type: Number, // e.g 2000 calories m 8 hours sleep etc
      required: true,
    },
    currentValue: {
      type: Number,
      default: 0,
      // we will increase as user logs the activities
    },
    deadline: {
      type: Date,
      required: true,
    },
    achieved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const GoalModel = mongoose.model("Goal", goalSchema);

module.exports = GoalModel;
