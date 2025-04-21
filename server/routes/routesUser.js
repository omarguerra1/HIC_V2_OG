import express from "express";//para facilitar conexion con el servidor
import { getAllUsers, createUser, updateUser, getUser, loginUser } from "../controllers/UserControllers.js";

const router = express.Router();

router.get('/', getAllUsers);
router.post('/register', createUser);
router.put('/update/:user_id', updateUser);
router.get('/get_user/:user_id', getUser);
router.post('/login', loginUser);  // Ruta para login

export default router;