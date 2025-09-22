const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createReminder, getReminders, updateReminder, deleteReminder } = require("../controllers/reminderController");

const reminderRouter = express.Router();

reminderRouter.post("/", authMiddleware, createReminder);
reminderRouter.get("/", authMiddleware, getReminders);
reminderRouter.put("/:id", authMiddleware, updateReminder);
reminderRouter.delete("/:id", authMiddleware, deleteReminder);

module.exports = reminderRouter;
