// express app setup

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// for routes
const healthRoutes = require("./routes/healthRoutes");
const authRouter = require("./routes/authRoutes");
const protectedRouter = require("./routes/protectedRoutes");
const activityRouter = require("./routes/activityRoutes");
const nutritionRouter = require("./routes/nutritionRoutes");
const sleepRouter = require("./routes/sleepRoutes");
const challengeRouter = require("./routes/challengeRoutes");
const habitRouter = require("./routes/habitRoutes");
const reminderRouter = require("./routes/reminderRoutes");
const communityRouter = require("./routes/communityRoutes");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// root route
app.get('/', (req,res)=>{
  res.status(200).json({ message: 'HealthyHabits API', status: 'ok' });
});

// test route
app.use("/api/health", healthRoutes);

app.use("/api/auth", authRouter);
app.use("/api/protected", protectedRouter);
app.use("/api/activities", activityRouter);
app.use("/api/nutrition", nutritionRouter);
app.use("/api/sleep", sleepRouter);
app.use("/api/challenges", challengeRouter);
app.use('/api/habits',habitRouter)
app.use('/api/reminders',reminderRouter)
app.use('/api/community',communityRouter)

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found', path: req.originalUrl });
});

// error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
