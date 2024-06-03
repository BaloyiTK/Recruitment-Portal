import asyncHandler from "express-async-handler";
import JobApplication from "../../models/application.js";
import sendApplicationStatusUpdateEmail from "../../services/communication/sendApplicationStatusUpdateEmail.js";

const getApplicationById = asyncHandler(async (req, res) => {
    try {
        const { appId } = req.params;
        const { role, email } = req.user;

        const application = await JobApplication.findById(appId);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (role === "admin" && application.status === "pending") {
            application.status = "viewed";
            await application.save();
            sendApplicationStatusUpdateEmail(email, "Viewed");
        }

        return res.json(application);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default getApplicationById;
