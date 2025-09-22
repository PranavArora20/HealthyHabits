const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { logMeal, getMeals } = require("../controllers/nutritionController");

const nutritionRouter = express.Router();

nutritionRouter.post("/log", authMiddleware, logMeal);
nutritionRouter.get("/", authMiddleware, getMeals);

module.exports = nutritionRouter;
