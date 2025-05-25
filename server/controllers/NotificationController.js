// controllers/NotificationController.js
import NotificationModel from "../models/NotificationModel.js";

export const getNotificationsByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const notes = await NotificationModel.findAll({
      where: { user_id },
      order: [["createdAt", "DESC"]]
    });
    return res.status(200).json(notes);
  } catch (error) {
    console.error("Error al listar notificaciones:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    await NotificationModel.update(
      { is_read: true },
      { where: { notification_id: id } }
    );
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error al marcar notificación leída:", error);
    return res.status(500).json({ message: error.message });
  }
};

// (Opcional) endpoint para pruebas o creación desde frontend
export const createNotification = async (req, res) => {
  const { user_id, message } = req.body;
  try {
    const note = await NotificationModel.create({ user_id, message });
    return res.status(201).json(note);
  } catch (error) {
    console.error("Error al crear notificación:", error);
    return res.status(500).json({ message: error.message });
  }
};
