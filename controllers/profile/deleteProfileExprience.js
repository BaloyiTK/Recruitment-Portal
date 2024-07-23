import asyncHandler from "express-async-handler";
import Profile from "../../models/profile.js";

const deleteProfileExprience = asyncHandler(async (req, res) => {
  try {
    const experienceId = req.params.experienceId;
    const userId = req.user.userId;

    // Find the profile associated with the user
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Find the index of the education entry to be deleted
    const experienceIndex = profile.experience.findIndex(
      (exp) => exp.id === experienceId
    );

    if (experienceIndex === -1) {
      return res.status(404).json({ message: "Exprience not found" });
    }

    // Remove the education entry
    profile.experience.splice(experienceIndex, 1);

    // Save the updated profile
    await profile.save();

    res.status(200).json({ message: "Exprience deleted successfully" });
  } catch (error) {
    console.error("Error deleting Exprience:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default deleteProfileExprience;
