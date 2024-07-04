import asyncHandler from "express-async-handler";
import Job from "../../models/job.js";

// Define an async function to get jobs posted by a recruiter
const getRecruiterjobs = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const accountType = req.user.accountType;


    console.log(userId)

    // Check if the user is a recruiter
    if (accountType !== "recruiter") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Fetch jobs posted by the current user (recruiter)
    const jobs = await Job.find({ postedBy: userId });

    // If no jobs found, return 404
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "Jobs not found" });
    }

    // Send the jobs array as response
    res.send(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default getRecruiterjobs;
