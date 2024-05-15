import asyncHandler from "express-async-handler";
import JobApplication from "../../models/application.js";

const getUserApplications = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log(userId);
    const applications = await JobApplication.find({userId:userId});

    if (!applications) {
        return res.status(404).json({ message: "Applications not found" });
    }
     res.send(applications);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default getUserApplications;
