import MedicamentoModel from "../models/MedicamentoModel.js";
// Obtener todos los medicamentos
export const getAllMedicamentos = async (req, res) => {
    try {
        const medicamentos = await MedicamentoModel.findAll();
        res.json(medicamentos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Obtener un medicamento específico
export const getMedicamento = async (req, res) => {
    try {
        const medicamento = await MedicamentoModel.findOne({
            where: { medicamento_id: req.params.id },
        });

        if (medicamento) {
            res.json(medicamento);
        } else {
            res.status(404).json({ message: "Medicamento no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Crear un nuevo medicamento
export const createMedicamento = async (req, res) => {
    const { nombre, flavor, dosis, frecuencia, prescription_id } = req.body;

    try {
        const newMedicamento = await MedicamentoModel.create({
            nombre: nombre,
            flavor: flavor,
            dosis: dosis,
            frecuencia: frecuencia,
            prescription_id: prescription_id,
        });

        res.status(201).json({
            success: true,
            message: "Medicamento creado",
            medicamento: newMedicamento,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    } 
};
// Actualizar un medicamento
export const updateMedicamento = async (req, res) => {
    try {
        const [updated] = await MedicamentoModel.update(req.body, {
            where: { medicamento_id: req.params.id },
        });

        if (updated) {
            const updatedMedicamento = await MedicamentoModel.findOne({
                where: { medicamento_id: req.params.id },
            });
            res.status(200).json({
                message: "Medicamento actualizado",
                medicamento: updatedMedicamento,
            });
        } else {
            res.status(404).json({ message: "Medicamento no encontrado" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Eliminar un medicamento
export const deleteMedicamento = async (req, res) => {
    try {
        const deleted = await MedicamentoModel.destroy({
            where: { medicamento_id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({ message: "Medicamento eliminado" });
        } else {
            res.status(404).json({ message: "Medicamento no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
