const mongoose = require("mongoose");

const participationSchema = new mongoose.Schema(
  {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    progress: { type: Number, default: 0 }, // accumulated metric (e.g., steps)
    points: { type: Number, default: 0 }, // gamification metric
    completed: { type: Boolean, default: false },
    lastUpdated: { type: Date },
  },
  { timestamps: true }
);

participationSchema.index({ challengeId: 1, userId: 1 }, { unique: true });

const ParticipationModel = mongoose.model("Participation", participationSchema);
module.exports = ParticipationModel;
