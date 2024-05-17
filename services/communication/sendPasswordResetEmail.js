// sendPasswordResetEmail.js

import nodemailer from "nodemailer";

const sendPasswordResetEmail = async (recipientEmail, resetToken) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Assuming resetToken contains the token generated for the user
const resetURL = `http://localhost:3000/reset-password?token=${resetToken}`;

const mailOptions = {
  from: process.env.EMAIL_ADDRESS, // Sender email address
  to: recipientEmail,
  subject: "Password Reset",
  html: `
    <body>
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hello,</p>
        <p>You are receiving this email because we received a password reset request for your account. If you did not request a password reset, please ignore this email.</p>
        <p>To reset your password, please click the following link:</p>
        <p><a href="${resetURL}">Reset Password</a></p>
        <p>If you're having trouble clicking the "Reset Password" button, copy and paste the following URL into your web browser:</p>
       
        <p>This password reset link is valid for a limited time only.</p>
        <p>If you continue to experience issues, please contact support.</p>
        <p>Thank you,</p>
        <p>Your Company Name</p>
      </div>
    </body>
  `,
};


  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully!");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email.");
  }
};
export default sendPasswordResetEmail;
