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
      resume
    } = req.body;

    // Update profile fields conditionally
    profile.firstName = firstName || profile.firstName;
    profile.lastName = lastName || profile.lastName;
    profile.headline = headline || profile.headline;
    profile.idNumber = idNumber || profile.idNumber;
    profile.ethnicity = ethnicity || profile.ethnicity;
    profile.location = location || profile.location;
    profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
    profile.gender = gender || profile.gender;
    profile.email = email || profile.email;
    profile.cellNumber = cellNumber || profile.cellNumber;
    profile.altNumber = altNumber || profile.altNumber;
    profile.contactNumber = contactNumber || profile.contactNumber;
    profile.disabilityStatus = disabilityStatus || profile.disabilityStatus;
    profile.citizenship = citizenship || profile.citizenship;
    profile.skills = skills || profile.skills;
    profile.attendedProgram = attendedProgram || profile.attendedProgram;
    profile.hasExperience = hasExperience || profile.hasExperience;
    profile.status = status || profile.status;
    profile.position = position || profile.position;
    profile.qualificationDocuments = qualificationDocuments || profile.qualificationDocuments;
    profile.otherDocuments = otherDocuments || profile.otherDocuments;
    profile.roleDescription = roleDescription || profile.roleDescription;
    profile.resume = resume || profile.resume;

    // Update experience array if provided
    if (experience && experience.length > 0) {
      experience.forEach((exp, index) => {
        if (!profile.experience[index]) {
          profile.experience[index] = {}; // Initialize if undefined
        }
        profile.experience[index].title = exp.title || profile.experience[index].title;
        profile.experience[index].company = exp.company || profile.experience[index].company;
        profile.experience[index].location = exp.location || profile.experience[index].location;
        profile.experience[index].startDate = exp.startDate || profile.experience[index].startDate;
        profile.experience[index].endDate = exp.endDate || profile.experience[index].endDate;
        profile.experience[index].employmentType = exp.employmentType || profile.experience[index].employmentType;
        profile.experience[index].responsibilities = exp.responsibilities || profile.experience[index].responsibilities;
      });
    }

    // Update education array if provided
    if (education && education.length > 0) {
      education.forEach((edu, index) => {
        if (!profile.education[index]) {
          profile.education[index] = {}; // Initialize if undefined
        }
        profile.education[index].institution = edu.institution || profile.education[index].institution;
        profile.education[index].institutionType = edu.institutionType || profile.education[index].institutionType;
        profile.education[index].degree = edu.degree || profile.education[index].degree;
        profile.education[index].fieldOfStudy = edu.fieldOfStudy || profile.education[index].fieldOfStudy;
        profile.education[index].startDate = edu.startDate || profile.education[index].startDate;
        profile.education[index].endDate = edu.endDate || profile.education[index].endDate;
      });
    }

    // Save the updated profile
    await profile.save();

    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

export default updateProfile;
