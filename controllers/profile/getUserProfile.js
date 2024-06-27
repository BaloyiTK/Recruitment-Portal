import asyncHandler from "express-async-handler";
import Profile from "../../models/profile.js";

// Define an async function to get one user by ID
const getUserProfile = asyncHandler(async (req, res) => {
    try {
    
        const userId =  req.params.userId;
        console.log(userId)
        const profile = await Profile.findOne({ user: userId });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found", profile });
        }

        res.send(profile);
        

    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default getUserProfile;

