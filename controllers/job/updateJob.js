import asyncHandler from "express-async-handler";
import Job from "../../models/job.js";

const updateJob = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const { title, company, location, salary, description } = req.body;

    const jobId = req.params.jobId;
    const job = await Job.findById(jobId)

    // Construct an object containing only the fields that have been provided in the request body
    if (title) job.title = title;
    if (company) job.company = company;
    if (location) job.location = location;
    if (salary) job.salary = salary;
    if (description) job.description = description;

    // Update job in the database only with the provided fields
    
    await job.save()

    res.send(job)
 

  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).send("Internal Server Error");
  }
});

export default updateJob;
