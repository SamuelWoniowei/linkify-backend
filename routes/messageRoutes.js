import express from "express";

import authenticateJWT from "../middleware/authenticateJwt.js";
import { getMessageHistory } from "../controllers/messageController.js";

const router = express.Router();


router.get("/:recipientId", authenticateJWT, getMessageHistory);
export default router;
