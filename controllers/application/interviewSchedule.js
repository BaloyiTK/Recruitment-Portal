import asyncHandler from "express-async-handler";
import JobApplication from "../../models/application.js";
import sendApplicationStatusUpdateEmail from "../../services/communication/sendApplicationStatusUpdateEmail.js";
import User from "../../models/user.js";

const interviewSchedule = asyncHandler(async (req, res) => {
    try {
        const { appId } = req.params;
        const { accountType } = req.user;

        const application = await JobApplication.findById(appId);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (accountType === "recruiter" && application.status !== "rejected") {
            application.status = "interview";
            await application.save();

            const applicant = await User.findById(application.userId);
            if (applicant) {
                sendApplicationStatusUpdateEmail(applicant.email, application.status);
            }
        }

        return res.json(application);
    } catch (error) {
        console.error("Error rejecting application:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default interviewSchedule;
