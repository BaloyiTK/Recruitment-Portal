import asyncHandler from "express-async-handler";
import Job from "../../models/job.js";

const deleteJob = asyncHandler(async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = await Job.findByIdAndDelete(jobId)
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default deleteJob;
