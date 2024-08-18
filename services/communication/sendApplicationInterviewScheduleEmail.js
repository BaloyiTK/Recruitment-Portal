import nodemailer from "nodemailer";
import ics from 'ics';

const sendApplicationInterviewScheduleEmail = async (recipientEmail, interviewData , organizer, applicantionDetails) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASS,
    },
  });

  const {firstName, lastName, title} = applicantionDetails

  const { start_url, join_url, password, start_time, duration, id, timezone } = interviewData;
  console.log(recipientEmail)
  // Format start time
  const startDate = new Date(start_time);
  const formattedStartTime = startDate.toLocaleString('en-US', { timeZone: timezone });

  // Define organizer details
  const organizerEmail = organizer.email // Organizer email
  const organizerName = organizer.username; // Organizer name

  // Create .ics event
  const event = {
    start: [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate(), startDate.getHours(), startDate.getMinutes()],
    duration: { minutes: duration },
    title: 'Interview',
    description: 'Scheduled interview meeting',
    location: join_url,
    url: join_url,
    status: 'CONFIRMED',
    organizer: { name: organizerName, email: organizerEmail }, // Add organizer details
  };

  const { error, value } = ics.createEvent(event);

  if (error) {
    console.error('Error creating .ics file:', error);
    throw new Error('Failed to create calendar event.');
  }

  // Email message options
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: recipientEmail,
    subject: `Interview Invitation for ${firstName} ${lastName} - ${title} Position`,
    html: `
   
      <p><strong>Date and Time:</strong> ${formattedStartTime} (${timezone})</p>
      <p><strong>Duration:</strong> ${duration} minutes</p>
      <p><strong>Join URL:</strong> <a href="${join_url}">${join_url}</a></p>
      <p><strong>Meeting Id:</strong> ${id}</p>
      <p><strong>Meeting Password:</strong> ${password}</p>
      <p>To join the meeting, click the Join URL and enter the password when prompted.</p>
      <p>Thank you!</p>
    `,
    attachments: [
      {
        filename: 'interview.ics',
        content: value,
        encoding: 'utf-8',
      },
    ],
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

export default sendApplicationInterviewScheduleEmail;
