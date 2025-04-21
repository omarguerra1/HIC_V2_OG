import db from "../database/db.js";
import { DataTypes, Sequelize } from "sequelize";
import UserModel from "./UserModel.js"

const OrderModel = db.define('order', {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    prescription_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    order_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    state: {
        type: DataTypes.ENUM('Preparando', 'Lista', 'Entregada', 'Cancelada'),
        defaultValue: 'Preparando',
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    delivery_schedule: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
    timestamps: true,
});

export default OrderModel;