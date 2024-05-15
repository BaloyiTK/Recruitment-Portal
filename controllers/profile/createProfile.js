import asyncHandler from "express-async-handler";
import Profile from "../../models/profile.js";

// async handler to handle the create profile functionality
const createProfile = asyncHandler(async (req, res) => {
  try {

    const user = req.user.userId

    // Extract profile details from the request body
    const { firstName, lastName, headline, location, dateOfBirth, gender, email, contactNumber, disabilityStatus, citizenship,
       skills, experience, education, resume } = req.body;

    // Create a new profile instance with the extracted details
    const newProfile = new Profile({
      user,
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
    });

    // Save the new profile to the database
    await newProfile.save();

    // Send the newly created profile as a response
    res.status(201).json(newProfile);
  } catch (error) {
    // If an error occurs during profile creation, handle it and send an error response
   // console.error("Error creating profile:", error);
    res.status(500).send(error.errors.user.message);
  }
});

// Export the createProfile function
export default createProfile;
