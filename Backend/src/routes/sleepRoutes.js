const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createSleep,
  getSleeps,
  getSleepStats,
  getSleepById,
  updateSleep,
  deleteSleep,
} = require("../controllers/sleepController");

const sleepRouter = express.Router();

sleepRouter.post("/", authMiddleware, createSleep);
sleepRouter.get("/", authMiddleware, getSleeps);
sleepRouter.get("/stats", authMiddleware, getSleepStats);
sleepRouter.get("/:id", authMiddleware, getSleepById);
sleepRouter.put("/:id", authMiddleware, updateSleep);
sleepRouter.delete("/:id", authMiddleware, deleteSleep);

module.exports = sleepRouter;
