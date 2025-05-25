// routes/notificationRoutes.js
import express from "express";
import {
  getNotificationsByUser,
  markAsRead,
  createNotification
} from "../controllers/NotificationController.js";

const router = express.Router();

// Listar notificaciones de un usuario
router.get("/:user_id", getNotificationsByUser);

// Marcar una notificación como leída
router.put("/read/:id", markAsRead);

// (Opcional) Crear notificación manualmente
router.post("/", createNotification);

export default router;
