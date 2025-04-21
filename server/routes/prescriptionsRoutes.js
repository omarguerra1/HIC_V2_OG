import express from "express"; // Para facilitar la conexión con el servidor
import {getAllPrescriptions,getPrescription,createPrescription,updatePrescription,deletePrescription,uploadImage} from "../controllers/PrescriptionControllers.js";

const router = express.Router();
// Obtener todas las recetas
router.get('/get_prescriptions', getAllPrescriptions);
// Obtener una receta por su ID
router.get('/:id', getPrescription);
// Crear una nueva receta con imagen
router.post('/', uploadImage, createPrescription);
// Actualizar una receta existente
router.put('/:id', updatePrescription);
// Eliminar una receta
router.delete('/:id', deletePrescription);
export default router;
