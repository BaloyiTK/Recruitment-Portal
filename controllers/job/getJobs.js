import asyncHandler from "express-async-handler";
import Job from "../../models/job.js";

// Define an async function to get one user by ID
const getJobs = asyncHandler(async (req, res) => {
  try {
   
     const jobs = await Job.find();


     console.log("get jobs")
  
    if (!jobs) {
      return res.status(404).json({ message: "Jobs not found" });
    }

    res.send(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default getJobs;
