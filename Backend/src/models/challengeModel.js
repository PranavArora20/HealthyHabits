const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["steps", "calories", "sleepHours", "custom"],
      default: "custom",
    },
    target: { type: Number, required: true }, // e.g., steps target
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isPublic: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

challengeSchema.index({ startDate: 1, endDate: 1 });

const ChallengeModel = mongoose.model("Challenge", challengeSchema);

module.exports = ChallengeModel;
