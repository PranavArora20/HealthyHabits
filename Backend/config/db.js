const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      console.error("Mongo URI not set. Please set MONGO_URI or MONGODB_URI in .env");
      process.exit(1);
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    const { host, name } = mongoose.connection;
    console.log(`MongoDB connected → host: ${host}, db: ${name}`);
  } catch (err) {
    console.log("MongoDb connection Failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectToDb;
