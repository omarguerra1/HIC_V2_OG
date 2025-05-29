import db from "../database/db.js"; // Conexión a la base de datos
import { DataTypes, Sequelize } from "sequelize"; 
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
        defaultValue: 'general', 
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
    },
    updatedAt: {
        type: DataTypes.DATE,
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'), 
    }
}, {
    timestamps: true, // Esto habilita los campos createdAt y updatedAt
});

export default UserModel;
