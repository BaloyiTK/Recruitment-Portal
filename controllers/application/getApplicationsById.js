import asyncHandler from "express-async-handler";
import JobApplication from "../../models/application.js";

// Define an async function to get one user by ID
const getApplicationsById = asyncHandler(async (req, res) => {
    try {
        const appId = req.params.appId;

        const role = req.user.role;
     

        const applications = await JobApplication.findById(appId);

         if (!applications) {
             return res.status(404).json({ message: "Application not found" });
         }

         if (role=="admin") {
             applications.status="viewed"
             await applications.save()
            
         }

         res.send(applications);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default getApplicationsById ;