import db from "../database/db.js";
import { DataTypes } from "sequelize";

const PrescriptionModel = db.define('prescription', {
    prescription_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    flavor: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
    image_format: {
        type: DataTypes.ENUM('JPEG', 'PNG', 'JPG'),
        allowNull: false,
    },
    image_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    upload_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },//edite aqui
    nombre_completo: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    peso: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha_de_nacimiento: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    padecimiento: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    i_lactosa: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    timestamps:true,
}
);


export default PrescriptionModel;