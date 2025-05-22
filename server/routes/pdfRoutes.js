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
    const { userName, userMatricula, pago, userOrderID, medicamentos, tipoPago } = req.body;

    try {
        let templateFile = '';  // Determinar la plantilla según el tipo de pago
        if (tipoPago === 'ventanilla') {
            templateFile = 'HOJA_DE_PAGO#1.pdf';  // Sigue siendo la misma
        } else if (tipoPago === 'transferencia') {
            templateFile = 'HOJA_DE_PAGO#2.pdf';  // Nueva plantilla
        } else {
            return res.status(400).json({ success: false, message: "Tipo de pago inválido" });
        }

        const templatePath = path.join(__dirname, '..', 'uploads', templateFile);
        if (!fs.existsSync(templatePath)) {
            return res.status(404).json({ success: false, message: "Archivo de plantilla no encontrado" });
        }

        const templateBytes = fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(templateBytes);
        const firstPage = pdfDoc.getPages()[0];

        // Agregar datos al PDF
        firstPage.drawText(`${userName}`, {x: 110, y: 653, size: 11});
        firstPage.drawText(`${userMatricula}`, { x: 125, y: 595, size: 11 });
        firstPage.drawText(`${userOrderID}`, { x: 146, y: 565, size: 11 });
        firstPage.drawText(`${pago}`, { x: 145, y: 128, size: 11 });
        firstPage.drawText(`${medicamentos.join(', ')}`, { x: 72, y: 500, size: 11 });

        // Guardar el nuevo PDF con nombres distintos según el tipo de pago
        const outputFile = tipoPago === 'ventanilla' ? `recibo_ventanilla_${userMatricula}.pdf` : `recibo_transferencia_${userMatricula}.pdf`;
        const outputPath = path.join(__dirname, '..', 'uploads', outputFile);
        fs.writeFileSync(outputPath, await pdfDoc.save());

        // **Enviar el archivo al frontend**
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${outputFile}`);
        res.send(Buffer.from(await pdfDoc.save()));

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        res.status(500).json({ success: false, message: `Error al generar el PDF: ${error.message}` });
    }
});

export default router;