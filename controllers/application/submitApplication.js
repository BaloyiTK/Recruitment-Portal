import asyncHandler from "express-async-handler";
import JobApplication from "../../models/application.js";
import Profile from "../../models/profile.js";
import Job from "../../models/job.js";
import sendJobApplicationConfirmationEmail from "../../services/communication/sendJobApplicationConfirmationEmail.js";
import User from "../../models/user.js";
import Notification from "../../models/notification.js"; 


const submitApplication = asyncHandler(async (req, res) => {
  try {
    // Receive application data from request body
    const { coverLetter } = req.body;
    const jobId = req.params.jobId;

    // Find the job posting
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const postedBy = job.postedBy;
    const userId = req.user.userId;

    // Check if the user has already applied for this job
    const appliedJob = await JobApplication.findOne({
      jobId: jobId,
      userId: userId,
    });
    // if (appliedJob) {
    //   return res.status(400).json({ message: "Job already applied" });
    // }

    // Retrieve the user's profile and get the resume
    const userProfile = await Profile.findOne({ user: userId });
    const resume = userProfile ? userProfile.resume : null;

    // Create a new job application
    const newApplication = new JobApplication({
      jobId,
      userId,
      postedBy,
      resume,
      coverLetter,
    });

    // Create notifications for both the applicant and the recruiter
    const applicantNotification = new Notification({
      userId: userId, // Notification for the applicant
      title: "Job Application Submitted",
      message: `You have successfully applied for the job titled "${job.title}".`,
    });

    const recruiterNotification = new Notification({
      userId: postedBy, // Notification for the recruiter
      title: "New Job Application",
      message: `A new application has been submitted for the job titled "${job.title}".`,
    });

    // Save the new job application
    await newApplication.save();

    // Save notifications individually with separate error handling
    try {
      await applicantNotification.save();
      console.log("Applicant notification saved successfully.");
    } catch (err) {
      console.error("Error saving applicant notification:", err);
    }

    try {
      await recruiterNotification.save();
      console.log("Recruiter notification saved successfully.");
    } catch (err) {
      console.error("Error saving recruiter notification:", err);
    }

    // Send job application confirmation email
    const user = await User.findById(userId); // Retrieve user details for email
    const recruiter = await User.findById(postedBy); // Retrieve recruiter details for email
    await sendJobApplicationConfirmationEmail(user.email, recruiter.email, job);

    // Respond with success
    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    // Handle errors and send an error response
    console.error("Error submitting application:", error);
    res
      .status(500)
      .json({ message: "Failed to submit application", error: error.message });
  }
});

// Export the submitApplication function
export default submitApplication;
