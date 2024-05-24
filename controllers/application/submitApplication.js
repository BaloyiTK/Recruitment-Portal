import asyncHandler from "express-async-handler";
import JobApplication from "../../models/application.js";
import Profile from "../../models/profile.js";
import Job from "../../models/job.js";

// async handler to handle the submit application functionality
const submitApplication = asyncHandler(async (req, res) => {
  try {
    // Receive application data from request body
    const { coverLetter } = req.body;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      res.status(404).json({ message: "Job not found" });

    }

    const userId = req.user.userId;
    // Retrieve the user's profile and get the resume
    const userProfile = await Profile.findOne({ user: userId });
    const resume = userProfile ? userProfile.resume : null;

    // Create a new instance of the JobApplication model
    const newApplication = new JobApplication({
      jobId,
      userId,
      resume,
      coverLetter,
    });

    // Save the new job application to the database
    await newApplication.save();

    // Send a success response
    res
      .status(201)
      .json({
        message: "Application submitted successfully",
        application: newApplication,
      });
  } catch (error) {
    // If an error occurs during application submission, handle it and send an error response
    console.error("Error submitting application:", error);
    res
      .status(500)
      .json({ message: "Failed to submit application", error: error.message });
  }
});

// Export the submitApplication function
export default submitApplication;
