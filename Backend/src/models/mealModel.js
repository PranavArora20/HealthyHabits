const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mealName: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    macros: {
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    },
    loggedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const MealModel = mongoose.model("Meal", mealSchema);

module.exports = MealModel;
