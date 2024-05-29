// sendPasswordResetEmail.js
import nodemailer from "nodemailer";
import User from "../../models/user.js";

const sendPasswordResetEmail = async (recipientEmail, resetToken, type) => {
  const user = await User.findOne({ email: recipientEmail });

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

  const resetURL = `${process.env.CLIENT_BASE_URL }/reset-password?token=${resetToken}`;

  let mailOptions;

  if (type === "forgot") {
    mailOptions = {
      from: process.env.EMAIL_ADDRESS, 
      to: recipientEmail,
      subject: "Password Reset request",
      html: `
      <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Hello ${user.username},</p>
          <p>You are receiving this email because we received a password reset request for your account.</p>
          <p>To reset your password, please click the following link:</p>
          <p><a href="${resetURL}">Reset Password</a></p>
          <p>If you're having trouble clicking the "Reset Password" button, copy and paste the following URL into your web browser:</p>

          <p>${resetURL}</p>
         
          <p>This password reset link is valid for a limited time only.</p>
          <p>If you continue to experience issues, please contact support.</p>
          <p>Thank you,</p>
          <p>Ikusasa Technology Solutions</p>
        </div>
      </body>
    `,
    };
  } else {
    mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: recipientEmail,
      subject: "Password Reset successfully",
      html: `
    <body>
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hello ${user.username},</p>
        <p>Your password has been successfully reset.</p>
        <p>If you did not perform this action, please contact support immediately.</p>
        <p>Thank you,</p>
        <p>Ikusasa Technology Solutions</p>
      </div>
    </body>
  `,
    };
  }

  try {
  
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully!");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email.");
  }
};
export default sendPasswordResetEmail;
