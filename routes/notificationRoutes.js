// jobRoutes.js
import express from "express";
import { authenticate } from "../middleswares/authMiddleware.js";
import getNotifications from "../controllers/communicaation/getNotifications.js";
import getNotificationById from "../controllers/communicaation/getNotificationById.js";
import deleteNotification from "../controllers/communicaation/deleteNotification.js";

const router = express.Router();

router.get("/notifications",authenticate, getNotifications);
router.get("/notifications/:notificationId", authenticate,getNotificationById);
router.delete("/notifications/:notificationId", authenticate, deleteNotification);

export default router;
