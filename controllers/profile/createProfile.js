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
    const user = req.user.userId;
    const username = req.user.username;

    const profile = await Profile.findOne({ user });

    if (profile) {
      return res.status(409).json({ message: "Profile already exists" });
    }

    // Extract profile details from the request body
    const {
      firstName,
      middleName,
      lastName,
      idNumber,
      Ethnicity,
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

  

    // Ensure the resume file is provided
    if (!resume) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    // Upload resume to Cloudinary with custom public_id and folder
    const uploadOptions = {
      folder: 'resume', // Folder in Cloudinary
      public_id: `resume_${username}_${Date.now()}`, // Custom public_id with timestamp
      resource_type: "raw", // Automatically determine the type of file
      allowed_formats: ["docx", "doc"], // Specify allowed formats
      chunk_size: 6000000, // Adjust chunk size as per your requirement
      timeout: 600000, // Adjust timeout in milliseconds as per your requirement
    };



    const result = await cloudinary.uploader.upload(resume, uploadOptions);

 

    const resumeUrl = result.secure_url;

    // Create a new profile instance with the extracted details
    const newProfile = new Profile({
      user,
      firstName,
      middleName,
      lastName,
      idNumber,
      Ethnicity,
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
    res.status(500).send({ message: "Failed to create profile", error });
  }
});

// Export the createProfile function
export default createProfile;
