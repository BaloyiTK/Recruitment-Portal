// authRoutes.js
import express from "express";
import { authenticate, authorize } from "../middleswares/authMiddleware.js";
import deleteProfile from "../controllers/profile/deleteProfile.js";
import updateProfile from "../controllers/profile/updateProfile.js";
import getUserProfile from "../controllers/profile/getUserProfile.js";
import getMyProfile from "../controllers/profile/getMyProfile.js";
import deleteProfileExprience from "../controllers/profile/deleteProfileExprience.js";
import deleteProfileEducation from "../controllers/profile/deleteProfileEducation.js";
import downloadResume from "../controllers/profile/downloadResume.js";


const router = express.Router();

router.get("/profile", authenticate, getMyProfile);
router.get("/profile/resume/:userId", authenticate, downloadResume);
router.get("/profile/:userId", authenticate, authorize(["recruiter"]), getUserProfile);
router.patch("/profile", authenticate, updateProfile);
router.delete("/profile/experience/:experienceId", authenticate, deleteProfileExprience);
router.delete("/profile/education/:educationId", authenticate, deleteProfileEducation);
router.delete("/profile",authenticate, deleteProfile);


export default router;
