// communicationController.js

// Import necessary modules and functions
import asyncHandler from "express-async-handler";
import sendRegistrationVerificationEmail from "../../services/communication/sendRegistrationVerificationEmail.js";
import sendPasswordResetEmail from "../../services/communication/sendPasswordResetEmail.js";
import sendJobApplicationConfirmationEmail from "../../services/communication/sendJobApplicationConfirmationEmail.js";
import sendApplicationStatusUpdateEmail from "../../services/communication/sendApplicationStatusUpdateEmail.js";

// Controller function for sending communication
const sendCommunication = asyncHandler(async (req, res) => {
  // Extract necessary information from request body
  const { type, recipient, data } = req.body;

  try {
    // Determine the type of communication and send accordingly
    switch (type) {
      case 'registrationVerification':
        await sendRegistrationVerificationEmail(recipient, data);
        break;
      case 'passwordReset':
        await sendPasswordResetEmail(recipient, data);
        break;
      case 'jobApplicationConfirmation':
        await sendJobApplicationConfirmationEmail(recipient, data);
        break;
      case 'applicationStatusUpdate':
        await sendApplicationStatusUpdateEmail(recipient, data);
        break;
      default:
        throw new Error('Invalid communication type.');
    }

    // Respond with success message
    return res.status(200).json({ message: "Communication sent successfully!" });
  } catch (error) {
    // Respond with error message if any error occurs
    return res.status(400).json({ message: error.message });
  }
});

// Export the controller function
export default sendCommunication;
