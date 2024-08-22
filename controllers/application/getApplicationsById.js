import asyncHandler from "express-async-handler";
import JobApplication from "../../models/application.js";
import sendApplicationStatusUpdateEmail from "../../services/communication/sendApplicationStatusUpdateEmail.js";
import Notification from "../../models/notification.js";
import User from "../../models/user.js";

const getApplicationById = asyncHandler(async (req, res) => {
  try {
    const { appId } = req.params;
    const { accountType } = req.user;

    // Fetch the application by ID
    const application = await JobApplication.findById(appId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the user is a recruiter and the application status is pending
    if (accountType === "recruiter" && application.status === "pending") {
      application.status = "viewed";
      await application.save();

      // Fetch the applicant details
      const applicant = await User.findById(application.userId);
      if (applicant) {
        // Send email notification to the applicant

        sendApplicationStatusUpdateEmail(applicant.email, application.status);

        // Create and save a notification for the applicant
        const notification = new Notification({
          userId: applicant._id, // Use applicant._id for the notification
          title: "Job Application Viewed",
          message: `Your application has been viewed by the recruiter.`,
        });

        await notification.save();
      }
    }

    return res.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default getApplicationById;
