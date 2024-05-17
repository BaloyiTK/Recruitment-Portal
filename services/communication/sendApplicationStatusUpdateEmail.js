// sendApplicationStatusUpdateEmail.js

import nodemailer from "nodemailer";

const sendApplicationStatusUpdateEmail = async (recipientEmail, applicationStatus) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Configure your email service provider here
    service: "gmail",
    auth: {
      user: "your-email@gmail.com",
      pass: "your-email-password"
    }
  });

  // Email message options
  const mailOptions = {
    from: "your-email@gmail.com",
    to: recipientEmail,
    subject: "Application Status Update",
    html: `<p>Your application status has been updated.</p>
           <p>New Status: ${applicationStatus}</p>`
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Application status update email sent successfully!");
  } catch (error) {
    console.error("Error sending application status update email:", error);
    throw new Error("Failed to send application status update email.");
  }
};

export default sendApplicationStatusUpdateEmail;
