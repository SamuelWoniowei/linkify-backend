import express from "express";
import { getAllNotifications, readNotification } from "../controllers/notificationControllers.js";

const router = express.Router();

router.get("/", getAllNotifications);
router.get("/:id/read", readNotification);

export default router;
