import nodemailer from "nodemailer";

const sendRegistrationVerificationEmail = async (recipientEmail, otp, type) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS,
      },
    });

    let subject, htmlContent;

    if (type === "verified") {
      subject = "Email Verified Successfully";
      htmlContent = `<p>Thank you for registering!</p>`;
    } else {
      subject = "Please verify your email address";
      htmlContent = `<p>Complete your registration</p>
                     <p>Here is your one-time pin: ${otp}</p>`;
    }

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: recipientEmail,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email.");
  }
};

export default sendRegistrationVerificationEmail;
