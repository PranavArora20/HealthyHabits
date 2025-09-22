// user registeration

const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateTokens = (userId) => {
  const normalizedUserId = typeof userId === "object" && userId._id ? String(userId._id) : String(userId);
  const accessToken = jwt.sign({ userId: normalizedUserId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    { userId: normalizedUserId },
    process.env.JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // user not present , then we will create the user and store the hash password in DB

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // here 10 is saltRounds

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log("new user saved :", newUser);
    const { accessToken, refreshToken } = generateTokens(newUser._id);
    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    // password matches the hashed password -> generate token
    const { accessToken, refreshToken } = generateTokens(user._id);
    res
      .status(200)
      .json({ message: "Login Successfull", accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { registerUser, loginUser };
