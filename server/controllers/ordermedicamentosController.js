import ordermedicamentosModel from "../models/ordermedicamentosModel.js";

export const getordermedicamentos = async (req, res) => {
    try {
        const { page = 1, perPage = 10 } = req.query;
        const offset = (page - 1) * perPage;

        const ordermed = await ordermedicamentosModel.findAll({
            limit: parseInt(perPage),
            offset: parseInt(offset),
            order: [["order_id", "DESC"]]
        });

        const total = await ordermedicamentosModel.count();
        const totalPages = Math.ceil(total / perPage);

        res.json({ ordermed, totalPages });
    } catch (error) {
        console.error("Error al obtener historial de pagos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};