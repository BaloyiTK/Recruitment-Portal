import nodemailer from "nodemailer";

const sendJobApplicationConfirmationEmail = async (applicantEmail, recruiterEmail, applicationDetails) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465', // Assuming 465 is for secure SMTP
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email message options for applicant
  const applicantMailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: applicantEmail,
    subject: "Job Application Confirmation",
    html: `<p>Thank you for applying for the job!</p>
           <p>Your application details:</p>
           <ul>
             <li>Title: ${applicationDetails.title}</li>
             <li>Description: ${applicationDetails.description}</li>
           </ul>`
  };

  // Email message options for recruiter
  const recruiterMailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: recruiterEmail,
    subject: "New Job Application Received",
    html: `<p>A new job application has been received!</p>
           <p>Applicant details:</p>
           <ul>
             <li>Title: ${applicationDetails.title}</li>
             <li>Description: ${applicationDetails.description}</li>
           </ul>`
  };

  try {
    // Send the email to the applicant
    await transporter.sendMail(applicantMailOptions);
    console.log("Job application confirmation email sent to applicant successfully!");

    // Send the email to the recruiter
    await transporter.sendMail(recruiterMailOptions);
    console.log("Job application notification email sent to recruiter successfully!");
  } catch (error) {
    console.error("Error sending job application emails:", error);
    throw new Error("Failed to send job application emails.");
  }
};

export default sendJobApplicationConfirmationEmail;
