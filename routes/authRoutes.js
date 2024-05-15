// authRoutes.js
import express from "express";
import { authenticate, authorize } from "../middleswares/authMiddleware.js";
import register from "../controllers/auth/registerController.js";
import login from "../controllers/auth/loginController.js";
import logout from "../controllers/auth/logoutController.js";
import { makeAdmin, makeEditor } from "../controllers/auth/userRoleController.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/make-admin", authenticate, authorize("admin"), makeAdmin);
router.post("/make-editor",authenticate, authorize("admin"),  makeEditor);
router.get("/logout", authenticate , logout);

export default router;
