import db from "../database/db.js"; // Se busca conectarse a la base de datos
import { DataTypes } from "sequelize"; // Tipo de datos para cada atributo de la base de datos

const RoleModel = db.define('roles', {
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    role_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
});

export default RoleModel;
