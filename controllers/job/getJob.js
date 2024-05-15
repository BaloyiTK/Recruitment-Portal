import asyncHandler from "express-async-handler";
import Job from "../../models/job.js";

// Define an async function to get one user by ID
const getJob = asyncHandler(async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId)
        
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.send(job);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default getJob;