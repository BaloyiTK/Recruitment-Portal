// sendRegistrationVerificationEmail.js
import nodemailer from "nodemailer";

const sendRegistrationVerificationEmail = async (recipientEmail, otp) => {
  // Create a Nodemailer transporter
 // Create a Nodemailer transporter
 const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS,
  },
});

  // Email message options
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS, // Sender email address
    to: recipientEmail,
    subject: "Please verify your email address",
    html: `
      <p>Thank you for registering!</p>
      <p>here is  your one time pin ${otp}</p>
    `
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email.");
  }
};

export default sendRegistrationVerificationEmail;
