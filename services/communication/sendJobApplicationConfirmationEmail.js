// sendJobApplicationConfirmationEmail.js

import nodemailer from "nodemailer";

const sendJobApplicationConfirmationEmail = async (recipientEmail, applicationDetails) => {
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
    subject: "Job Application Confirmation",
    html: `<p>Thank you for applying for the job!</p>
           <p>Your application details:</p>
           <ul>
             <li>Name: ${applicationDetails.name}</li>
             <li>Email: ${applicationDetails.email}</li>
             <li>Position: ${applicationDetails.position}</li>
             <li>Resume: ${applicationDetails.resume}</li>
           </ul>`
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Job application confirmation email sent successfully!");
  } catch (error) {
    console.error("Error sending job application confirmation email:", error);
    throw new Error("Failed to send job application confirmation email.");
  }
};

export default sendJobApplicationConfirmationEmail;
