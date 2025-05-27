import db from "../database/db.js";
import { DataTypes, Sequelize } from "sequelize";
//import UserModel from "./UserModel.js"

const ordermedicamentosModel = db.define('order_medicamentos', {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_usuario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    matricula: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    medicamento: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    flavor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dosis: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    frecuencia: {
        type: DataTypes.STRING,
        allowNull: false,
    },
        precio: {                                 // ← Nuevo campo
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    }
}, {
    timestamps: false,
});

export default ordermedicamentosModel;