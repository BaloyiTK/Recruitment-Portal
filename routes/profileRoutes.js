// authRoutes.js
import express from "express";
import createProfile from "../controllers/profile/createProfile.js";
import { authenticate, authorize } from "../middleswares/authMiddleware.js";
import deleteProfile from "../controllers/profile/deleteProfile.js";
import updateProfile from "../controllers/profile/updateProfile.js";
import getUserProfile from "../controllers/profile/getUserProfile.js";
import getMyProfile from "../controllers/profile/getMyProfile.js";

const router = express.Router();

router.get("/profile", authenticate, getMyProfile);
router.get("/profile/:userId", authenticate, authorize(["jobseeker"]), getUserProfile);
router.post("/profile", authenticate, createProfile);
router.patch("/profile", authenticate, updateProfile);
router.patch("/profile", authenticate, updateProfile);
router.patch("/profile", authenticate, updateProfile);
router.delete("/profile",authenticate, deleteProfile);

export default router;
