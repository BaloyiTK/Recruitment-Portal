// jobRoutes.js
import express from "express";
import createJob from "../controllers/job/createJob.js";
import deleteJob from "../controllers/job/deleteJob.js";
import getJob from "../controllers/job/getJob.js";
import updateJob from "../controllers/job/updateJob.js";
import { authenticate, authorize } from "../middleswares/authMiddleware.js";
import getJobs from "../controllers/job/getJobs.js";
import getRecruiterjobs from "../controllers/job/getRecruiterJobs.js";

const router = express.Router();

router.post("/jobs", authenticate, authorize("recruiter"), createJob);
router.get("/jobs/:jobId", getJob);
router.get("/jobs", getJobs);
router.get("/jobs/org/recruiter", authenticate, authorize(["recruiter"]), getRecruiterjobs);
router.patch("/job/:jobId", authenticate, authorize("recruiter"), updateJob);
router.delete("/job/:jobId", authenticate, authorize("recruiter"), deleteJob);

export default router;
