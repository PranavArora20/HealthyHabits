const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const ActivityModel = require("../models/activityModel");
const {
  createActivity,
  getActivities,
  updateActivity,
  deleteActivity,
} = require("../controllers/activityController");

const activityRouter = express.Router();

// Create an activity
activityRouter.post("/", authMiddleware, createActivity);

// Get all activities
activityRouter.get("/", authMiddleware, getActivities);

module.exports = activityRouter;
