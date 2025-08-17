const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});

const sendMail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"My App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Mail sent to ${to}`);
    return { success: true };
  } catch (err) {
    console.error("❌ Mail error:", err);
    return { success: false, error: err.message };
  }
};

module.exports = sendMail;
