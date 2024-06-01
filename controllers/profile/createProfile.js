import asyncHandler from "express-async-handler";
import Profile from "../../models/profile.js";

// async handler to handle the create profile functionality
const createProfile = asyncHandler(async (req, res) => {
  try {
    const user = req.user.userId;

    const profile = await Profile.findOne({ user: user });

    if (profile) {
      return res.status(409).json({ message: "Profile already exist" });
    }

    // Extract profile details from the request body
    const {
      firstName,
      middleName,
      lastName,
      location,
      dateOfBirth,
      gender,
      email,
      cellNumber,
      altNumber,
      position,
      status,
      disabilityStatus,
      citizenship,
      skills,
      experience,
      education,
      resume,
      otherDocuments,
    } = req.body;

    // Create a new profile instance with the extracted details
    const newProfile = new Profile({
      user,
      firstName,
      middleName,
      lastName,
      location,
      position,
      status,
      dateOfBirth,
      gender,
      email,
      cellNumber,
      altNumber,
      disabilityStatus,
      citizenship,
      skills,
      experience,
      education,
      resume,
      otherDocuments,
    });

    // Save the new profile to the database
    await newProfile.save();

    // Send the newly created profile as a response
    res.status(201).json(newProfile);
  } catch (error) {
    // If an error occurs during profile creation, handle it and send an error response
    console.error("Error creating profile:", error);
    res.status(500).send(error);
  }
});

// Export the createProfile function
export default createProfile;
