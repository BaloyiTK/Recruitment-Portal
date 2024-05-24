// jobRoutes.js
import express from "express";
import createJob from "../controllers/job/createJob.js";
import getjobs from "../controllers/job/getJobs.js";
import deleteJob from "../controllers/job/deleteJob.js";
import getJob from "../controllers/job/getJob.js";
import updateJob from "../controllers/job/updateJob.js";
import { authenticate, authorize } from "../middleswares/authMiddleware.js";

const router = express.Router();

router.post("/jobs", authenticate, authorize("admin"), createJob);
router.get("/jobs/:jobId", getJob);
router.get("/jobs", getjobs);
router.patch("/job/:jobId", authenticate, authorize("admin"), updateJob);
router.delete("/job/:jobId", authenticate, authorize("admin"), deleteJob);

export default router;
