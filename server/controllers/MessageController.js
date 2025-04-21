import MessageModel from "../models/MessageModel.js";

export const getAllMsgs = async (req, res) => {
    try {
        const msgs = await MessageModel.findAll({ 

        });

        res.status(200).json({
            messages: msgs,
        });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener los mensajes: " + error.message });
    }
};

export const createMsg = async (req, res) => {
    const { sender_id, receiver_id, msg_content, respondingTo } = req.body;
    try {
        const newMsg = await MessageModel.create({ sender_id, receiver_id, msg_content, respondingTo });
        res.status(200).json({
            success: true,
            msg: "Mensaje creado exitosamente",
            message: {
                sender_id: newMsg.sender_id,
                receiver_id: newMsg.receiver_id,
                respondingTo: newMsg.respondingTo,
                msg_content: newMsg.msg_content,
                msg_date: newMsg.msg_date,
            }
        });
    } catch (error) {
        res.status(400).json({ message: "Error al crear el mensaje: " + error.message });
    }
};

export const updateMsg = async (req, res) => {
    const { msg_id } = req.params;
    try {
        const [updated] = await MessageModel.update(req.body, {
            where: { msg_id },
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};