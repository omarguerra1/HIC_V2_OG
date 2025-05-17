import db from "../database/db.js";
import { DataTypes, Sequelize } from "sequelize";
//import UserModel from "./UserModel.js"

const HistorialPagosModel = db.define('historial_pagos', {
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
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.ENUM('Preparando', 'Lista', 'Entregada', 'Cancelada'),
        defaultValue: 'Preparando',
    },
}, {
    timestamps: false,
});

export default HistorialPagosModel;