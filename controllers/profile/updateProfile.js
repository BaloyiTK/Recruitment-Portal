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

    // Update only the fields that are provided in the request body
    if (firstName) profile.firstName = firstName;
    if (lastName) profile.lastName = lastName;
    if (headline) profile.headline = headline;
    if (location) profile.location = location;
    if (dateOfBirth) profile.dateOfBirth = dateOfBirth;
    if (gender) profile.gender = gender;
    if (email) profile.email = email;
    if (contactNumber) profile.contactNumber = contactNumber;
    if (disabilityStatus) profile.disabilityStatus = disabilityStatus;
    if (citizenship) profile.citizenship = citizenship;
    if (skills) profile.skills = skills;
    if (experience) profile.experience = experience;
    if (education) profile.education = education;
    if (resume) profile.resume = resume;
    
    // Save the updated profile
    await profile.save();

    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

export default updateProfile;
