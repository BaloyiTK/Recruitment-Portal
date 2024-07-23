import asyncHandler from "express-async-handler";
import Profile from "../../models/profile.js";
import { v2 as cloudinary } from 'cloudinary';

// Use environment variables for sensitive data
cloudinary.config({ 
  cloud_name: 'dz5avxnag', 
  api_key: 734462673897543, 
  api_secret: 'Z7E57J6W_a8uMvQ9vsvTd1jOyAA'
});

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find the user's profile by userId
    let profile = await Profile.findOne({ user: userId });

    // If the profile doesn't exist, create a new one
    if (!profile) {
      profile = new Profile({ user: userId });
    }

    // Extract profile details from the request body
    const {
      firstName,
      lastName,
      profilePicture,
      headline,
      idNumber,
      ethnicity,
      location,
      dateOfBirth,
      gender,
      email,
      cellNumber,
      altNumber,
      contactNumber,
      disabilityStatus,
      citizenship,
      skills,
      attendedProgram,
      hasExperience,
      status,
      position,
      qualificationDocuments,
      otherDocuments,
      roleDescription,
      experience,
      education,
      resume,
    } = req.body;

  
    
    // Update profile fields conditionally
    if (firstName !== undefined) profile.firstName = firstName;
    if (lastName !== undefined) profile.lastName = lastName;
    if (headline !== undefined) profile.headline = headline;
    if (idNumber !== undefined) profile.idNumber = idNumber;
    if (ethnicity !== undefined) profile.ethnicity = ethnicity;
    if (location !== undefined) profile.location = location;
    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
    if (gender !== undefined) profile.gender = gender;
    if (email !== undefined) profile.email = email;
    if (cellNumber !== undefined) profile.cellNumber = cellNumber;
    if (altNumber !== undefined) profile.altNumber = altNumber;
    if (contactNumber !== undefined) profile.contactNumber = contactNumber;
    if (disabilityStatus !== undefined) profile.disabilityStatus = disabilityStatus;
    if (citizenship !== undefined) profile.citizenship = citizenship;
    if (skills !== undefined) profile.skills = skills;
    if (attendedProgram !== undefined) profile.attendedProgram = attendedProgram;
    if (hasExperience !== undefined) profile.hasExperience = hasExperience;
    if (status !== undefined) profile.status = status;
    if (position !== undefined) profile.position = position;
    if (qualificationDocuments !== undefined) profile.qualificationDocuments = qualificationDocuments;
    if (otherDocuments !== undefined) profile.otherDocuments = otherDocuments;
    if (roleDescription !== undefined) profile.roleDescription = roleDescription;
    if (resume !== undefined) profile.resume = resume;


    if (profilePicture) {
      try {
        // Upload resume to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload('https://i.dailymail.co.uk/1s/2024/07/11/19/87218215-13625093-image-a-39_1720721817987.jpg');
        profile.profilePicture = cloudinaryResponse.secure_url;
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        return res.status(500).json({ success: false, message: "Error uploading resume" });
      }
    }

    // Update or append to experience array if provided
    if (experience && Array.isArray(experience)) {
      experience.forEach((exp) => {
        const existingExp = profile.experience.id(exp._id);
        if (existingExp) {
          Object.assign(existingExp, exp);
        } else {
          profile.experience.push(exp);
        }
      });
    }

    // Update or append to education array if provided
    if (education && Array.isArray(education)) {
      education.forEach((edu) => {
        const existingEdu = profile.education.id(edu._id);
        if (existingEdu) {
          Object.assign(existingEdu, edu);
        } else {
          profile.education.push(edu);
        }
      });
    }

    // Save the updated profile
    await profile.save();

    res.status(200).json({ success: true, message: "Profile updated successfully" , profile});
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default updateProfile;
