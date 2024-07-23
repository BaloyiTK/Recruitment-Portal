import asyncHandler from "express-async-handler";
import Profile from "../../models/profile.js";

const getMyProfile = asyncHandler(async (req, res) => {
    try {


        const userId = req.user.userId;
    
        const profile = await Profile.findOne({ user: userId });

   

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({ message: "Profile successfully retrieved", profile });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default getMyProfile;
