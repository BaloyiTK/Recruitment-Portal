import asyncHandler from "express-async-handler";
import Job from "../../models/job.js";

// async handler to handle the create job functionality
const createJob = asyncHandler(async (req, res) => {
  try {
    // Extract job details from the request body
    const postedBy = req.user.userId;
    const { title, company, location, salary, description } = req.body;

    const job = new Job({
      title,
      company,
      location,
      salary,
      description,
      postedBy 
    });

    // Save the job to the database
    await job.save();

    // Send a success response
    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    // If an error occurs during job creation, handle it and send an error response
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Export the createJob function
export default createJob;
