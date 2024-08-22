import asyncHandler from "express-async-handler";
import JobApplication from "../../models/application.js";
import sendApplicationStatusUpdateEmail from "../../services/communication/sendApplicationStatusUpdateEmail.js";
import User from "../../models/user.js";
import Notification from "../../models/notification.js";

const rejectApplication = asyncHandler(async (req, res) => {
    try {
        const { appId } = req.params;
        const { accountType } = req.user;

        const application = await JobApplication.findById(appId);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (accountType === "recruiter" && application.status !== "rejected") {
            application.status = "rejected";
            await application.save();

            const applicant = await User.findById(application.userId);
            if (applicant) {
                sendApplicationStatusUpdateEmail(applicant.email, application.status);
                const notification = new Notification({
                    userId: applicant._id, // Use applicant._id for the notification
                    title: "Job Application Unsuccessful",
                    message: `Job Application Unsuccessful.`,
                  });
          
                  await notification.save();
            }
        }

        return res.json(application);
    } catch (error) {
        console.error("Error rejecting application:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default rejectApplication;
