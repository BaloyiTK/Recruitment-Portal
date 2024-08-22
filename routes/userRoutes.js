import express from "express";
import getLoggedInUser from "../controllers/auth/getLoggedInUser.js";
import getOneUser from "../controllers/user/getOneUser.js";
import getAllUsers from "../controllers/user/getAllUsers.js";
import { authenticate, authorize } from "../middleswares/authMiddleware.js";
import deleteUser from "../controllers/user/deleteUser.js";
import updateUser from "../controllers/user/updateUser.js";

const router = express.Router();

router.get("/user/me", authenticate, getLoggedInUser);
router.get("/user/:id", authenticate, getOneUser);
router.get("/users", authenticate, authorize("recruiter, admin"), getAllUsers);
router.delete("/user/:id", authenticate, deleteUser);;
router.patch("/user/:id", authenticate, updateUser);

export default router;
