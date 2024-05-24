// appRoutes.js
import express from "express";
import submitApplication from "../controllers/application/submitApplication.js";
import withdrawApplication from "../controllers/application/withdrawApplication.js";
import { authenticate, authorize } from "../middleswares/authMiddleware.js";
import getAllApplications from "../controllers/application/getAllApplications.js";
import getApplicationsById from "../controllers/application/getApplicationsById.js";
import getUserApplications from "../controllers/application/getUserAppllications.js";

const router = express.Router();

// Route for submitting an application
router.post("/applications/:jobId/submit", authenticate, submitApplication);
router.get("/applications/me", authenticate, getUserApplications);
router.get("/applications/:appId", authenticate,getApplicationsById );
router.get("/applications", authenticate, authorize("admin"), getAllApplications);
router.delete("/applications/:appId/withdraw", authenticate, withdrawApplication)


export default router;
