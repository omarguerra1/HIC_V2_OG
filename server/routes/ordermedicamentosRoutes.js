import express from "express";
import { getordermedicamentos } from "../controllers/ordermedicamentosController.js"; 

const router = express.Router();

router.get("/", getordermedicamentos);

export default router;