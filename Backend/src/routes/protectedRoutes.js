const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const protectedRouter = express.Router();

protectedRouter.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to Your Profile",
    userId: req.user.userId,
  });
});

module.exports = protectedRouter;
