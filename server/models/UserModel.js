import db from "../database/db.js"; // Conexión a la base de datos
import { DataTypes, Sequelize } from "sequelize"; // Asegúrate de importar Sequelize
import OrderModel from "./OrderModel.js"

const UserModel = db.define('users', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name_: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    password_: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    matricula: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('general', 'hic_admin'),
        defaultValue: 'general', // Por defecto, los nuevos usuarios son generales
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Usa Sequelize.literal para obtener el timestamp actual
    },
    updatedAt: {
        type: DataTypes.DATE,
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'), // Se actualiza automáticamente cuando se hace un update
    }
}, {
    timestamps: true, // Esto habilita los campos createdAt y updatedAt
});

export default UserModel;
