// appRoutes.js
import express from "express";
import submitApplication from "../controllers/application/submitApplication.js";
import withdrawApplication from "../controllers/application/withdrawApplication.js";
import { authenticate, authorize } from "../middleswares/authMiddleware.js";
import getAllApplications from "../controllers/application/getAllApplications.js";
import getApplicationsById from "../controllers/application/getApplicationsById.js";
import getUserApplications from "../controllers/application/getUserAppllications.js";
import rejectApplication from "../controllers/application/rejectApplication.js";
import interviewSchedule from "../controllers/application/interviewSchedule.js";
import zoomMeeting from "../controllers/application/zoomMeeting.js";




const router = express.Router();

router.post("/applications/:jobId/submit", authenticate, submitApplication);
router.get("/applications/me", authenticate, getUserApplications);
router.get("/applications/:appId", authenticate,getApplicationsById );
router.get("/applications", authenticate, authorize("recruiter"), getAllApplications);
router.delete("/applications/:appId/withdraw", authenticate, withdrawApplication)
router.patch("/applications/:appId", authenticate, authorize("recruiter"), rejectApplication);
router.post("/applications/:appId", authenticate, authorize("recruiter"), interviewSchedule);
router.get("/applications/:appId/meeting", authenticate, authorize("recruiter"), interviewSchedule);
router.post("/api/create-meeting/:appId", authenticate, authorize("recruiter"), zoomMeeting);



export default router;
