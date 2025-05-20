import express from 'express';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import path from 'path';
import { fileURLToPath } from 'url';
//import path from 'path';


const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/generate-pdf', async (req, res) => {
    const { userMatricula, pago, medicamentos } = req.body;

    try {
        // Cargar plantilla PDF existente
        const templatePath = path.join(__dirname, '..', 'uploads', 'HOJA_DE_PAGO#1.pdf');
        if (!fs.existsSync(templatePath)) {
            return res.status(404).json({ success: false, message: "Archivo de plantilla no encontrado" });
        }

        const templateBytes = fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(templateBytes);
        const firstPage = pdfDoc.getPages()[0];

        // Agregar datos al PDF
        firstPage.drawText(`Matrícula: ${userMatricula}`, { x: 100, y: 700, size: 12 });
        firstPage.drawText(`Pago: ${pago}`, { x: 100, y: 680, size: 12 });
        firstPage.drawText(`Medicamentos: ${medicamentos.join(', ')}`, { x: 100, y: 660, size: 12 });

        // Guardar el nuevo PDF
        const modifiedPdfBytes = await pdfDoc.save();
        console.log("Tamaño del PDF generado:", modifiedPdfBytes.length);
        const outputPath = path.join(__dirname, '..', 'uploads', `recibo_${userMatricula}.pdf`);
        fs.writeFileSync(outputPath, modifiedPdfBytes);

        // **Enviar el archivo al frontend para descarga**
        //res.setHeader('Content-Type', 'application/pdf');
        //res.setHeader('Content-Disposition', `attachment; filename=recibo_${userMatricula}.pdf`);
        //res.send(modifiedPdfBytes);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=recibo_${userMatricula}.pdf`);
        res.send(Buffer.from(modifiedPdfBytes));  // ✅ Convertir los datos en un Buffer

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        res.status(500).json({ success: false, message: `Error al generar el PDF: ${error.message}` });
    }
});

export default router;