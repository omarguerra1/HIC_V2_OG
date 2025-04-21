import MedicamentoPrescriptionModel from "../models/MedPresModel.js";
// Obtener todas las relaciones entre medicamentos y prescripciones
export const getAllMedicamentoPrescriptions = async (req, res) => {
    try {
        const relations = await MedicamentoPrescriptionModel.findAll();
        res.json(relations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Crear una nueva relación entre prescripción y medicamento
export const createMedicamentoPrescription = async (req, res) => {
    const { prescription_id, medicamento_id } = req.body;
    try {
        const newRelation = await MedicamentoPrescriptionModel.create({
            prescription_id,
            medicamento_id,
        });

        res.status(201).json({
            message: "Relación creada",
            relation: newRelation,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Eliminar una relación específica
export const deleteMedicamentoPrescription = async (req, res) => {
    try {
        const deleted = await MedicamentoPrescriptionModel.destroy({
            where: { medicamento_prescripcion_id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({ message: "Relación eliminada" });
        } else {
            res.status(404).json({ message: "Relación no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
