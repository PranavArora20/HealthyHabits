const HabitModel = require("../models/habitModel");
const cron = require("node-cron");
const { sendMail } = require("../../config/mailer");

// Run every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  // Find habits matching reminder time
  const habits = await HabitModel.find({ reminderTime: currentTime }).populate(
    "user",
    "email name"
  );

  for (const habit of habits) {
    if (habit.user && habit.user.email) {
      const subject = `Reminder: ${habit.name}`;
      const text = `Hey ${habit.user.name || "there"}, don't forget to ${
        habit.name
      } today!`;

      await sendMail(habit.user.email, subject, text);
    }
  }
});
