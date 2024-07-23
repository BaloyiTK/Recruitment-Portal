import asyncHandler from "express-async-handler";
import Profile from "../../models/profile.js";

const deleteProfile = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.userId;

        const profile = await Profile.findOne({ user: userId });

        if (!profile) {
            res.status(404).json({ message: "Profile not found" });
            return;
        }

        // Delete the user from the database
        await Profile.deleteOne({ user: userId });

        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default deleteProfile;
