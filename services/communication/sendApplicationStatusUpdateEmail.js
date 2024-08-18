// sendApplicationStatusUpdateEmail.js

import nodemailer from "nodemailer";

const sendApplicationStatusUpdateEmail = async (recipientEmail, applicationStatus) => {

  console.log(recipientEmail, applicationStatus)

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
    from: process.env.EMAIL_ADDRESS,
    to: recipientEmail,
    subject: "Application Status Update",
    html: `<p>Your application status has been updated.</p>
           <p>New Status: ${applicationStatus}, </p>`
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
