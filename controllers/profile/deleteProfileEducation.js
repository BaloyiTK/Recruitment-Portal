import asyncHandler from "express-async-handler";
import Profile from "../../models/profile.js";

const deleteProfileEducation = asyncHandler(async (req, res) => {
  try {
    const educationId = req.params.educationId;
    const userId = req.user.userId;

    // Find the profile associated with the user
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Find the index of the education entry to be deleted
    const educationIndex = profile.education.findIndex(
      (edu) => edu.id === educationId
    );

    if (educationIndex === -1) {
      return res.status(404).json({ message: "Education not found" });
    }

    // Remove the education entry
    profile.education.splice(educationIndex, 1);

    // Save the updated profile
    await profile.save();

    res.status(200).json({ message: "Education deleted successfully" });
  } catch (error) {
    console.error("Error deleting education:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default deleteProfileEducation;
