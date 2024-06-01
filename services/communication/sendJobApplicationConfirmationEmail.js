// sendJobApplicationConfirmationEmail.js
import nodemailer from "nodemailer";

const sendJobApplicationConfirmationEmail = async (recipientEmail, applicationDetails) => {
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
    from: process.env.EMAIL_ADDRESS,
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
