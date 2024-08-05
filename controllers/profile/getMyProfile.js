import asyncHandler from "express-async-handler";
import Profile from "../../models/profile.js";
import path from "path";
import fs from "fs";

const getMyProfile = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const profile = await Profile.findOne({ user: userId });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Assuming resume filename is stored in the profile document
        const resumeFilename = profile.resumeFilename;
        if (resumeFilename) {
            const resumePath = path.join(__dirname, `../../uploads/resume/${resumeFilename}`);
            
            // Check if the resume file exists
            if (fs.existsSync(resumePath)) {
                // Send profile along with the resume file
                return res.status(200).json({
                    message: "Profile successfully retrieved",
                    profile,
                    resume: `/uploads/resume/${resumeFilename}` // Provide the URL to the resume file
                });
            }
        }

        // If resume file doesn't exist or isn't specified in profile, just send the profile
        res.status(200).json({ message: "Profile successfully retrieved", profile });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default getMyProfile;
