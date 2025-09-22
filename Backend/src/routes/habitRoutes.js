const express = require("express");
const habitRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  createHabit,
  getHabits,
  markHabit,
  deleteHabit,
} = require("../controllers/habitController");

habitRouter.post("/", authMiddleware, createHabit);
habitRouter.get("/", authMiddleware, getHabits);
habitRouter.post("/:id/mark", authMiddleware, markHabit);
habitRouter.delete("/:id", authMiddleware, deleteHabit);

module.exports = habitRouter;
