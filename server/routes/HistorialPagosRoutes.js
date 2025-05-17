import express from "express";
import { getHistorialPagos } from "../controllers/HistorialPagosController.js"; 

const router = express.Router();

router.get("/", getHistorialPagos);

export default router;