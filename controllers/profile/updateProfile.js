import asyncHandler from "express-async-handler";
import Profile from "../../models/profile.js";

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

    // Update or append to experience array if provided
    if (experience && Array.isArray(experience)) {
      experience.forEach((exp) => {
        // Check if the experience entry already exists
        const existingExp = profile.experience.id(exp._id);
        if (existingExp) {
          // Update existing experience
          existingExp.title = exp.title || existingExp.title;
          existingExp.company = exp.company || existingExp.company;
          existingExp.location = exp.location || existingExp.location;
          existingExp.startDate = exp.startDate || existingExp.startDate;
          existingExp.endDate = exp.endDate || existingExp.endDate;
          existingExp.employmentType = exp.employmentType || existingExp.employmentType;
          existingExp.responsibilities = exp.responsibilities || existingExp.responsibilities;
        } else {
          // Append new experience
          profile.experience.push({
            title: exp.title || "",
            company: exp.company || "",
            location: exp.location || "",
            startDate: exp.startDate || "",
            endDate: exp.endDate || "",
            employmentType: exp.employmentType || "",
            responsibilities: exp.responsibilities || ""
          });
        }
      });
    }

    // Update or append to education array if provided
    if (education && Array.isArray(education)) {
      education.forEach((edu) => {
        // Check if the education entry already exists
        const existingEdu = profile.education.id(edu._id);
        if (existingEdu) {
          // Update existing education
          existingEdu.institution = edu.institution || existingEdu.institution;
          existingEdu.institutionType = edu.institutionType || existingEdu.institutionType;
          existingEdu.degree = edu.degree || existingEdu.degree;
          existingEdu.fieldOfStudy = edu.fieldOfStudy || existingEdu.fieldOfStudy;
          existingEdu.startDate = edu.startDate || existingEdu.startDate;
          existingEdu.endDate = edu.endDate || existingEdu.endDate;
        } else {
          // Append new education
          profile.education.push({
            institution: edu.institution || "",
            institutionType: edu.institutionType || "",
            degree: edu.degree || "",
            fieldOfStudy: edu.fieldOfStudy || "",
            startDate: edu.startDate || "",
            endDate: edu.endDate || ""
          });
        }
      });
    }

    // Save the updated profile
    await profile.save();

    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default updateProfile;
