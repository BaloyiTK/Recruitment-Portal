import asyncHandler from "express-async-handler";
import Profile from "../../models/profile.js";

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find the user's profile by userId
    let profile = await Profile.findOne({ user: userId });

    // If the profile doesn't exist, create a new one
    if (!profile) {
      profile = new Profile({
        user: userId
      });
    }

    // Extract profile details from the request body
    const {
      firstName,
      lastName,
      headline,
      location,
      dateOfBirth,
      gender,
      email,
      contactNumber,
      disabilityStatus,
      citizenship,
      skills,
      experience,
      education,
      resume
    } = req.body;

    // Update profile fields conditionally
    profile.firstName = firstName || profile.firstName;
    profile.lastName = lastName || profile.lastName;
    profile.headline = headline || profile.headline;
    profile.location = location || profile.location;
    profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
    profile.gender = gender || profile.gender;
    profile.email = email || profile.email;
    profile.contactNumber = contactNumber || profile.contactNumber;
    profile.disabilityStatus = disabilityStatus || profile.disabilityStatus;
    profile.citizenship = citizenship || profile.citizenship;
    profile.skills = skills || profile.skills;
    profile.experience = experience || profile.experience;
    profile.education = education || profile.education;
    profile.resume = resume || profile.resume;

    // Save the updated profile
    await profile.save();

    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

export default updateProfile;
