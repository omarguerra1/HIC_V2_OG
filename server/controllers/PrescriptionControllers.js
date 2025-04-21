import multer from 'multer';
import path from 'path';
import fs from 'fs';
import PrescriptionModel from "../models/PrescriptionModel.js";
//multer para almacenar las imagenes en src/uploads
// Configuración de multer para manejar la subida de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Nombre único del archivo
    }
});

const upload = multer({ storage });

export const uploadImage = upload.single('image'); // Middleware para subir una sola imagen

// Obtener todas las recetas
export const getAllPrescriptions = async (req, res) => {
    try {
        const{ page = 1, limit = 10 } = req.query;
        const offset = (page - 1)*limit;

        const prescriptions = await PrescriptionModel.findAndCountAll({ 
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.status(200).json({
            prescriptions: prescriptions.rows,
            total: prescriptions.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(prescriptions.count/limit)
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
    // Verificamos si se subió la imagen
    if (!req.file) {
        return res.status(400).json({ message: "No se ha subido ninguna imagen." });
    }

    const { user_id, flavor, nombre_completo, peso, fecha_de_nacimiento, padecimiento, i_lactosa } = req.body; //edition from here
    const imageUrl = `/uploads/${req.file.filename}`; // La URL de la imagen

    // Validamos los campos obligatorios
    if (!user_id) {
        return res.status(400).json({ message: "Falta el ID del usuario." });
    }

    // Validamos el formato de la imagen
    const validFormats = ['image/jpeg', 'image/png'];
    if (!validFormats.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Formato de imagen no válido." });
    }

    try {
        // Creamos la nueva receta
        const newPrescription = await PrescriptionModel.create({
            user_id,
            flavor: flavor,
            image_url: imageUrl,  // Ruta de la imagen
            image_format: req.file.mimetype,  // Formato de la imagen
            image_size: req.file.size,  // Tamaño de la imagen //edition from here
            nombre_completo,
            peso,
            fecha_de_nacimiento,
            padecimiento,
            i_lactosa,
        });

        // Respondemos con éxito
        res.status(201).json({
            message: "Receta creada correctamente.",
            prescription: newPrescription,
        });
    } catch (error) {
        console.error("Error al crear la receta:", error);
        res.status(500).json({ message: error.message });
    }
};
// Actualizar una receta existente
export const updatePrescription = async (req, res) => {
    try {
        const [updated] = await PrescriptionModel.update(req.body, {
            where: { prescription_id: req.params.id },
        });

        if (updated) {
            const updatedPrescription = await PrescriptionModel.findOne({
                where: { prescription_id: req.params.id },
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
