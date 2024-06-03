// sendJobApplicationConfirmationEmail.js
import nodemailer from "nodemailer";

const sendJobApplicationConfirmationEmail = async (recipientEmail, applicationDetails) => {
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

const recipients = [
  { email: 'recipient1@example.com', applicationDetails: { title: 'Title 1', description: 'Description 1' } },
  { email: 'recipient2@example.com', applicationDetails: { title: 'Title 2', description: 'Description 2' } },

];

  // Email message options
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: recipientEmail,
    subject: "Job Application Confirmation",
    html: `<p>Thank you for applying for the job!</p>
           <p>Your application details:</p>
           <ul>
             <li>Title: ${applicationDetails.title}</li>
             <li>Description: ${applicationDetails.description}</li>
       
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
