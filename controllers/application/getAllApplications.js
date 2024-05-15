import asyncHandler from "express-async-handler";
import Application from "../../models/application.js";

// Define an async function to get one user by ID
const getAllApplications = asyncHandler(async (req, res) => {
    try {
        
        const applications = await Application.find()
        
        if (!applications) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.send(applications);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default getAllApplications;