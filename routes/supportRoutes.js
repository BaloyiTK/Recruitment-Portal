import express from "express";
import createTicket from "../controllers/support/createTicket.js";
import getTickets from "../controllers/support/getTickets.js";
import getTicketByNumber from "../controllers/support/getTicketByNumber.js";
import getTicketById from "../controllers/support/getTicketById.js";
import updateTicket from "../controllers/support/updateTicket.js";
import deleteTicket from "../controllers/support/deleteTicket.js";
import { authenticate, authorize } from "../middleswares/authMiddleware.js";

const router = express.Router();

router.post("/ticket", createTicket);
router.post("/ticket/user", authenticate, createTicket);
router.get("/ticket/all", getTickets);
router.get("/ticket", getTicketByNumber);
router.get("/ticket/:id", getTicketById);
router.patch("/ticket/:id",authenticate, authorize("admin"), updateTicket);
router.delete("/ticket/:id", deleteTicket);

export default router;
