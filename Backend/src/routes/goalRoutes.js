const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createGoal,
  getGoals,
  updatedGoalProgress,
  deleteGoal,
} = require("../controllers/goalController");

const goalRouter = express.Router();

goalRouter.post("/", authMiddleware, createGoal);
goalRouter.get("/", authMiddleware, getGoals);
goalRouter.put("/:id/progress", authMiddleware, updatedGoalProgress);
goalRouter.delete("/:id", authMiddleware, deleteGoal);

module.exports = goalRouter;
