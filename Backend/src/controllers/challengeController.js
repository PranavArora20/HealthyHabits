const mongoose = require("mongoose");
const ChallengeModel = require("../models/challengeModel");
const ParticipationModel = require("../models/participationModel");
const UserModel = require("../models/userModel");

function getMetricFromActivityForChallengeType(activity, challengeType) {
  // Map your activity.meta fields to challenge metric
  // activity: { type: 'exercise'|'nutrition'|'sleep'|..., meta: { steps, calories, hours, ... }, date }
  if (challengeType === "steps")
    return (
      activity.meta && (activity.meta.steps || activity.meta.distanceSteps || 0)
    );
  if (challengeType === "calories")
    return activity.meta && (activity.meta.calories || 0);
  if (challengeType === "sleepHours")
    return activity.hours || (activity.meta && activity.meta.hours) || 0;
  // for custom, expect activity.meta.value
  if (challengeType === "custom")
    return activity.meta && activity.meta.value ? activity.meta.value : 0;
  return 0;
}

const createChallenge = async (req, res) => {
  try {
    const payload = req.body;
    payload.createdBy = req.user.userId;
    const ch = await ChallengeModel.create(payload);
    return res.status(201).json(ch);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to create challenge" });
  }
};

const joinChallenge = async (req, res) => {
  try {
    const userId = req.user.userId;
    const challengeId = req.params.id;
    const ch = await ChallengeModel.findByIdAndUpdate(
      challengeId,
      { $addToSet: { participants: userId } },
      { new: true }
    );
    if (!ch) return res.status(404).json({ error: "Challenge not found" });

    // ensure Participation doc exists
    await ParticipationModel.findOneAndUpdate(
      { challengeId, userId },
      { $setOnInsert: { challengeId, userId, progress: 0 } },
      { upsert: true, new: true }
    );

    return res.json({ ok: true, challenge: ch });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to join" });
  }
};

const postProgress = async (req, res) => {
  // Manual progress post (delta) for a specific challenge
  try {
    const userId = req.user.userId;
    const challengeId = req.params.id;
    const { delta = 0 } = req.body; // number

    const ch = await ChallengeModel.findById(challengeId);
    if (!ch) return res.status(404).json({ error: "Challenge not found" });

    const now = new Date();
    if (now < ch.startDate || now > ch.endDate) {
      return res.status(400).json({ error: "Challenge not active" });
    }

    // atomic increment
    const p = await ParticipationModel.findOneAndUpdate(
      { challengeId, userId },
      {
        $inc: { progress: delta, points: Math.floor(delta / 1000) },
        $set: { lastUpdated: new Date() },
      },
      { upsert: true, new: true }
    );

    // if completed, mark and award
    if (!p.completed && p.progress + delta >= ch.target) {
      p.completed = true;
      await p.save();

      // Award points/badge to user (simple)
      await UserModel.findByIdAndUpdate(userId, {
        $inc: { "stats.totalPoints": 100 }, // example
        $addToSet: { badges: `challenge:${challengeId}:winner` },
      });
    }

    return res.json(p);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to post progress" });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const limit = parseInt(req.query.limit || "50", 10);

    // aggregation joining users
    const pipeline = [
      { $match: { challengeId: mongoose.Types.ObjectId(challengeId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: 1,
          progress: 1,
          points: 1,
          completed: 1,
          "user.name": 1,
          "user.avatarUrl": 1,
        },
      },
      { $sort: { progress: -1, points: -1 } },
      { $limit: limit },
    ];

    const rows = await ParticipationModel.aggregate(pipeline);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to get leaderboard" });
  }
};

const getMyChallenges = async (req, res) => {
  try {
    const userId = req.user.userId;
    const mine = await ChallengeModel.find({ participants: userId }).sort({
      startDate: -1,
    });
    return res.json(mine);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch" });
  }
};

const updateProgressForActivity = async (userId, activity) => {
  // This function can be called from activityController after saving activity
  try {
    const now = activity.date ? new Date(activity.date) : new Date();
    const activeChallenges = await ChallengeModel.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      participants: userId, // only user's joined challenges
    });

    if (!activeChallenges || activeChallenges.length === 0) return;

    for (const ch of activeChallenges) {
      const delta = getMetricFromActivityForChallengeType(activity, ch.type);
      if (!delta || delta <= 0) continue;

      // atomic update and possible completion check
      const updated = await ParticipationModel.findOneAndUpdate(
        { challengeId: ch._id, userId },
        {
          $inc: { progress: delta, points: Math.floor(delta / 1000) },
          $set: { lastUpdated: new Date() },
        },
        { upsert: true, new: true }
      );

      if (!updated.completed && updated.progress >= ch.target) {
        updated.completed = true;
        await updated.save();
        // award user - keep it light here
        await UserModel.findByIdAndUpdate(userId, {
          $inc: { "stats.totalPoints": 100 },
          $addToSet: { badges: `challenge:${ch._id}:winner` },
        });
      }
    }
  } catch (err) {
    console.error("updateProgressForActivity error", err);
  }
};

module.exports = {
  createChallenge,
  joinChallenge,
  postProgress,
  getLeaderboard,
  getMyChallenges,
  updateProgressForActivity,
};
