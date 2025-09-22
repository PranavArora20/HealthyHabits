// entry point for the server

const dotenv = require("dotenv");
const connectToDb = require("./config/db");
const app = require("./src/app");
dotenv.config();

connectToDb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Import background services AFTER the app is running
require("./src/services/reminderService");
