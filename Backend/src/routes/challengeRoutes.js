const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createChallenge,
  joinChallenge,
  postProgress,
  getLeaderboard,
  getMyChallenges,
} = require("../controllers/challengeController");
const challengeRouter = express.Router();

challengeRouter.post("/", authMiddleware, createChallenge); // create
challengeRouter.post("/:id/join", authMiddleware, joinChallenge); // join
challengeRouter.post("/:id/progress", authMiddleware, postProgress); // manual progress post
challengeRouter.get("/:id/leaderboard", authMiddleware, getLeaderboard); // leaderboard
challengeRouter.get("/mine", authMiddleware, getMyChallenges); // my joined challenges

module.exports = challengeRouter;
