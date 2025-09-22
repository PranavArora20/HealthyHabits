const mongoose = require("mongoose");
const SleepModel = require("../models/sleepModel");

const getUserId = (req) => {
  return req.user && req.user.userId ? String(req.user.userId) : null;
};

const createSleep = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { date, hoursSlept, sleepQuality, notes } = req.body;
    if (hoursSlept == null) {
      return res.status(400).json({ message: "hoursSlept is required" });
    }

    const sleep = new SleepModel({
      user: userId,
      date: date ? new Date(date) : new Date(),
      hoursSlept,
      sleepQuality,
      notes,
    });
    await sleep.save();
    return res.status(201).json(sleep);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getSleeps = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request" });
    }
    const { start, end, limit = 100, skip = 0 } = req.query;
    const filter = { user: userId };

    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = new Date(start);
      if (end) filter.date.$lte = new Date(end);
    }
    const sleeps = await SleepModel.find(filter)
      .sort({ date: -1 })
      .skip(parseInt(skip))
      .limit(Math.min(parseInt(limit), 1000));
    return res.json(sleeps);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getSleepById = async (req, res) => {
  try {
    const userId = getUserId(req);
    const sleep = await SleepModel.findOne({
      _id: req.params.id,
      user: userId,
    });
    if (!sleep) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.json(sleep);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateSleep = async (req, res) => {
  try {
    const userId = getUserId(req);
    const sleep = await SleepModel.findOneAndUpdate(
      {
        _id: req.params.id,
        user: userId,
      },
      { $set: req.body },
      { new: true }
    );
    if (!sleep) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.json(sleep);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteSleep = async (req, res) => {
  try {
    const userId = getUserId(req);
    const sleep = await SleepModel.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });
    if (!sleep) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getSleepStats = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { start, end } = req.query;
    const match = { user: new mongoose.Types.ObjectId(userId) };

    if (start || end) {
      match.date = {};
      if (start) match.date.$gte = new Date(start);
      if (end) {
        const endDate = new Date(end);
        endDate.setUTCHours(23, 59, 59, 999); // include full day
        match.date.$lte = endDate;
      }
    }

    const stats = await SleepModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$user",
          avgHours: { $avg: "$hoursSlept" },
          totalNights: { $sum: 1 },
          minHours: { $min: "$hoursSlept" },
          maxHours: { $max: "$hoursSlept" },
        },
      },
    ]);

    return res.json(
      stats[0] || { avgHours: 0, totalNights: 0, minHours: 0, maxHours: 0 }
    );
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSleep,
  getSleeps,
  getSleepById,
  updateSleep,
  deleteSleep,
  getSleepStats,
};
