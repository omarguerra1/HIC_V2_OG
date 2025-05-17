import HistorialPagosModel from "../models/HistorialPagosModel.js";

export const getHistorialPagos = async (req, res) => {
    try {
        const { page = 1, perPage = 10 } = req.query;
        const offset = (page - 1) * perPage;

        const historial = await HistorialPagosModel.findAll({
            limit: parseInt(perPage),
            offset: parseInt(offset),
            order: [["order_date", "DESC"]]
        });

        const total = await HistorialPagosModel.count();
        const totalPages = Math.ceil(total / perPage);

        res.json({ historial, totalPages });
    } catch (error) {
        console.error("Error al obtener historial de pagos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};