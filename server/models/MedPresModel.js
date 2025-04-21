import db from "../database/db.js";
import { DataTypes } from "sequelize";

const MedPresModel = db.define('medicamento_prescripcion', {
    medicamento_prescripcion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    prescription_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    medicamento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

// Relaciones
MedPresModel.belongsTo(db.models.prescription, { foreignKey: 'prescription_id' });
MedPresModel.belongsTo(db.models.medicamento, { foreignKey: 'medicamento_id' });

export default MedPresModel;
