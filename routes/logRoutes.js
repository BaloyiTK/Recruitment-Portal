import express from "express";
import { authenticate, authorize } from "../middleswares/authMiddleware.js";
import getLogs from "../controllers/logs/getLogs.js";

const router = express.Router();

router.get("/logs", authenticate, authorize("admin"), getLogs);

export default router;
