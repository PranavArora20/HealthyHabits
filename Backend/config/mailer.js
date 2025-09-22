const nodemailer = require("nodemailer");

// Use your Gmail/SMTP settings here
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const sendMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`📧 Reminder sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
  }
};

module.exports = { sendMail };
