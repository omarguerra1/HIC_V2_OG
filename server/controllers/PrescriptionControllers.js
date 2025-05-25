import { io } from "../main.js";
import PrescriptionModel from "../models/PrescriptionModel.js";
import UserModel from '../models/UserModel.js';
import NotificationModel from '../models/NotificationModel.js';
//multer para almacenar las imagenes en src/uploads
import multer from "multer";
// Configuración de multer para manejar la subida de imágenes
// Multer para subir la imagen
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
export const uploadImage = multer({ storage }).single('image');

// Obtener todas las recetas
export const getAllPrescriptions = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const prescriptions = await PrescriptionModel.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.status(200).json({
            prescriptions: prescriptions.rows,
            total: prescriptions.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(prescriptions.count / limit)
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios: " + error.message });
    }
};
// Obtener una receta por su ID
export const getPrescription = async (req, res) => {
    try {
        const prescription = await PrescriptionModel.findOne({
            where: { prescription_id: req.params.id },
        });

        if (prescription) {
            res.json(prescription);
        } else {
            res.status(404).json({ message: "Receta no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPrescription = async (req, res) => {
    // 1) Validar imagen
    if (!req.file) {
        return res.status(400).json({ message: "No se ha subido ninguna imagen." });
    }
    // 2) Extraer y normalizar sabores
    // Extraer y normalizar sabores
    let flavors;
    if (req.body.flavors) {
        flavors = Array.isArray(req.body.flavors) ? req.body.flavors : [req.body.flavors];
    } else if (req.body.flavor) {
        try {
            const parsed = JSON.parse(req.body.flavor);
            if (!Array.isArray(parsed)) throw new Error();
            flavors = parsed;
        } catch {
            return res.status(400).json({ message: "El campo 'flavor' debe ser un JSON array válido." });
        }
    } else {
        return res.status(400).json({ message: "No se recibió ningún sabor ('flavors' o 'flavor')." });
    }

    // **Ahora flavors está correctamente definido antes de usarlo**
    console.log("Flavors recibidos:", flavors);

    // 3) Desestructurar resto del body
    const {
        user_id,
        nombre_completo,
        peso,
        fecha_de_nacimiento,
        padecimiento,
        i_lactosa
    } = req.body;

    // 4) Validaciones mínimas
    if (!user_id) {
        return res.status(400).json({ message: "Falta el ID del usuario." });
    }
    const validFormats = ['image/jpeg', 'image/png'];
    if (!validFormats.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Formato de imagen no válido." });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    try {
        // 5) Crear la receta (tu modelo debe declarar flavor: DataTypes.JSON)
        const newPrescription = await PrescriptionModel.create({
            user_id,
            flavor: JSON.stringify(flavors),     // ← aquí va tu array JSON //sabores - flavors
            image_url: imageUrl,
            image_format: req.file.mimetype,
            image_size: req.file.size,
            nombre_completo,
            peso,
            fecha_de_nacimiento,
            padecimiento,
            i_lactosa
        });
        //notificar a los admin de los cambios
        const admins = await UserModel.findAll({ where: { role: "hic_admin" } });
        const msg = `Nueva receta (${newPrescription.prescription_id}) de ${newPrescription.nombre_completo} pendiente de aprobación.`;
        const created = await Promise.all(
            admins.map(a =>
                NotificationModel.create({ user_id: a.user_id, message: msg })
            )
        );
        console.log("🔔 Notificaciones creadas:", created.map(n => ({
            id: n.notification_id,
            user: n.user_id,
            msg: n.message
        })));
        io.emit("new-prescription", {
            prescriptionId: newPrescription.prescription_id,
            quien: newPrescription.nombre_completo,
            timestamp: new Date(),
        });
        return res.status(201).json({
            message: "Receta creada correctamente.",
            prescription: newPrescription
        });

    } catch (error) {
        console.error("Error al crear la receta:", error);
        return res.status(500).json({ message: error.message });
    }
};
// Actualizar una receta existente
export const updatePrescription = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await PrescriptionModel.update(req.body, {
            where: { prescription_id: id },
        });

        if (updated) {
            const updatedPrescription = await PrescriptionModel.findOne({
                where: { prescription_id: req.params.id },
            });
            const pres = await PrescriptionModel.findByPk(id);

            // Notificamos al usuario dueño de la receta:
            const created = await NotificationModel.create({
                user_id: pres.user_id,
                message: `Tu receta ${pres.prescription_id} ha sido aprobada y está lista para pago.`
            });
            console.log("🔔 Notificaciones creadas:", created.map(n => ({
                id: n.notification_id,
                user: n.user_id,
                msg: n.message
            })));
            io.emit("prescription-updated", {
                prescriptionId: pres.prescription_id,
                userId: pres.user_id,
                timestamp: new Date()
            });
            res.status(200).json({
                message: "Receta actualizada",
                prescription: updatedPrescription,
            });
        } else {
            res.status(404).json({ message: "Receta no encontrada" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Eliminar una receta
export const deletePrescription = async (req, res) => {
    try {
        const deleted = await PrescriptionModel.destroy({
            where: { prescription_id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({ message: "Receta eliminada" });
        } else {
            res.status(404).json({ message: "Receta no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//export { uploadImage };
