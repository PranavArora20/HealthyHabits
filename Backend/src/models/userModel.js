const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  stats: {
    totalPoints: { type: Number, default: 0 },
  },
  badges: [{ type: String }],
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;