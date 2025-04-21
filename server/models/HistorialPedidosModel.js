import db from "../database/db.js";
import { DataTypes } from "sequelize";

const HistorialPedidosModel = db.define('historial_pedidos', {
    historial_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    state: {
        type: DataTypes.ENUM('Confirmed', 'Processing', 'Shipped', 'Delivered'),
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

// Relaciones
HistorialPedidosModel.belongsTo(db.models.order, { foreignKey: 'order_id' });
HistorialPedidosModel.belongsTo(db.models.user, { foreignKey: 'user_id' });

export default HistorialPedidosModel;
