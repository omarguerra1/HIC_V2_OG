// routes/notificationRoutes.js
import express from "express";
import {
  getNotificationsByUser,
  markAsRead,
  createNotification
} from "../controllers/NotificationController.js";

const router = express.Router();


router.get("/:user_id", getNotificationsByUser);


router.put("/read/:id", markAsRead);


router.post("/", createNotification);

export default router;
