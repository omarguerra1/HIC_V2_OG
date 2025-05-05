import UserModel from "../models/UserModel.js";

export const getAllUsers = async (req, res) => {
    try {
        const{ page = 1, limit = 10 } = req.query;
        const offset = (page - 1)*limit;

        const users = await UserModel.findAndCountAll({ // Trae todos los usuarios
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.status(200).json({
            users: users.rows,
            total: users.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(users.count/limit)
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios: " + error.message });
    }
};

export const createUser = async (req, res) => {
    const { name_, email, password_, matricula, role } = req.body;
    try {
        // Validación de datos según el rol
        if (role === "hic_admin") {
            if (!email || !password_) {
                return res.status(400).json({
                    message: "Email y contraseña son obligatorios para administradores.",
                });
            }
        } else if (role === "general") {
            if (!matricula) {
                return res.status(400).json({
                    message: "La matrícula es obligatoria para usuarios generales.",
                });
            }
        } else {
            return res.status(400).json({ message: "El rol especificado no es válido." });
        }

        const newUser = await UserModel.create({ name_, email, password_, matricula, role });
        res.status(200).json({
            success: true,
            message: "Usuario registrado exitosamente",
            user: newUser,
            current_matricula: matricula
        });
    } catch (error) {
        res.status(400).json({ message: "Error al crear el usuario: " + error.message });
    }
};

export const updateUser = async (req, res) => { 
    const { user_id } = req.params;
    try {
        const [updated] = await UserModel.update(req.body, {
            where: { user_id },
        });

        if (updated) {
            const updatedUser = await UserModel.findOne({ where: { user_id } });
            res.status(200).json({
                message: "Usuario actualizado exitosamente.",
                user: {
                    user_id: updatedUser.user_id,
                    name_: updatedUser.name_,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    password_: updatedUser.password_,
                    matricula: updatedUser.matricula
                }
            });
        } else {
            res.status(404).json({ message: "Usuario no encontrado." });
        }
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar el usuario: " + error.message });
    }
};

export const getUser = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await UserModel.findOne({
            where: { user_id:user_id },
        });

        if (user) {
            res.status(200).json({
                user: {
                    name_: user.name_
                }
            });
        } else {
            res.status(404).json({ message: "Usuario no encontrado." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario: " + error.message });
    }
};

export const loginUser = async (req, res) => {
    /*Fn para manejo de login en backend*/
    let user;
    console.log("Solicitud de login recibida");
    const { email, password, rol } = req.body;

    try {
        //Buscar el usuario por correo y contraseña
        if(rol==="admin"){
            user = await UserModel.findOne({ where: { email : email, password_ : password } });
        } else {
            //user = await UserModel.findOne({ where: { email : email, matricula : password } });
            user = await UserModel.findOne({ where: { matricula : password } });
        }

        if (user) {
            //Si se encuentra el usuario, devolver datos de éxito
            res.status(200).json({
                message: "Login exitoso",
                user: {
                    user_id: user.user_id,
                    name_: user.name_,
                    email: user.email,
                    role: user.role,
                    password_: user.password_,
                    matricula: user.matricula
                }
            });
        } else {
            //Si no se encuentra el usuario, devolver error
            res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }
    } catch (error) {
        console.log("Error en el servidor:", error);
        res.status(500).json({ message: "Error del servidor", error: error.message });
    }
};