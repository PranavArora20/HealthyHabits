// entry point for the server

const dotenv = require("dotenv");
const connectToDb = require("./config/db");
const app = require("./src/app");
dotenv.config();

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectToDb();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    // Import background services AFTER the app is running
    require("./src/services/reminderService");
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
