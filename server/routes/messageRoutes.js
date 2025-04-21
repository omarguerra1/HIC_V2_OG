import express from "express";//para facilitar conexion con el servidor
import { createMsg, getAllMsgs, updateMsg } from "../controllers/MessageController.js";
import { resolveEnvPrefix } from "vite";
const router = express.Router();

router.get("/", getAllMsgs);
router.post('/new_msg', createMsg);
router.put("/update_msg/:msg_id", updateMsg);
export default router;