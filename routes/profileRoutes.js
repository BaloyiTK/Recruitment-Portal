// authRoutes.js
import express from "express";
import createProfile from "../controllers/profile/createProfile.js";
import { authenticate } from "../middleswares/authMiddleware.js";
import getProfile from "../controllers/profile/getProfile.js";
import deleteProfile from "../controllers/profile/deleteProfile.js";
import updateProfile from "../controllers/profile/updateProfile.js";

const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.post("/profile", authenticate, createProfile);
router.patch("/profile", authenticate, updateProfile);
router.patch("/profile", authenticate, updateProfile);
router.patch("/profile", authenticate, updateProfile);
router.delete("/profile",authenticate, deleteProfile);

export default router;
