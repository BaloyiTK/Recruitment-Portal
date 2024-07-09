import asyncHandler from "express-async-handler";
import Profile from "../../models/profile.js";
import cloudinary from "cloudinary";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "dz5avxnag",
  api_key: "734462673897543",
  api_secret: "Z7E57J6W_a8uMvQ9vsvTd1jOyAA",
});

// async handler to handle the create profile functionality
const createProfile = asyncHandler(async (req, res) => {
  try {
    const { userId, username } = req.user; // Destructure userId and username from req.user

    // Check if profile already exists for the user
    const profile = await Profile.findOne({ user: userId });
    if (profile) {
      return res.status(409).json({ message: "Profile already exists" });
    }

    // Destructure profile details from the request body
    const {
      firstName,
      middleName,
      lastName,
      idNumber,
      ethnicity,
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

    let resumeUrl = null; // Initialize resumeUrl variable

    // Upload resume to Cloudinary if resume exists in the request body
    if (resume) {
      const uploadOptions = {
        folder: 'resume',
        public_id: `resume_${username}_${Date.now()}`,
        resource_type: "auto", // Use "auto" to automatically detect file type
        allowed_formats: ["docx", "doc", "pdf"], // Specify allowed formats
        chunk_size: 6000000, // Adjust chunk size as per your requirement
        timeout: 600000, // Adjust timeout in milliseconds as per your requirement
      };

      const result = await cloudinary.uploader.upload(resume, uploadOptions);
      resumeUrl = result.secure_url; // Store the secure URL of the uploaded resume
    }

    // Create a new profile instance with the extracted details
    const newProfile = new Profile({
      user: userId,
      firstName,
      middleName,
      lastName,
      idNumber,
      ethnicity,
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
      resume: resumeUrl,
      otherDocuments,
    });

    // Save the new profile to the database
    await newProfile.save();

    // Send the newly created profile as a response
    res.status(201).json(newProfile);
  } catch (error) {
    // If an error occurs during profile creation, handle it and send an error response
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Failed to create profile", error: error.message });
  }
});

// Export the createProfile function
export default createProfile;
