import db from "../database/db.js";
import { DataTypes } from "sequelize";
import OrderModel from "./OrderModel.js";  // importa el modelo
const MedicamentoModel = db.define('medicamentos', {
    medicamento_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    prescription_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    flavor: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    dosis: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    frecuencia: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    precio: {                                 
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    }
}, {
    timestamps: true,
});

export default MedicamentoModel;
