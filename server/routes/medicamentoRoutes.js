import express from "express";//para facilitar conexion con el servidor
import { getAllMedicamentos, getMedicamento, createMedicamento, updateMedicamento, deleteMedicamento } from "../controllers/MedicamentoControllers.js";
const router = express.Router();

router.get("/medicamentos", getAllMedicamentos);
router.get("/medicamento/:id", getMedicamento);
router.post("/new_med", createMedicamento);  // Cambio aquí de /medicamento a /medicamentos
router.put("/medicamento/:id", updateMedicamento);
router.delete("/medicamento/:id", deleteMedicamento);

export default router;
