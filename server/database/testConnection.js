import db from './db.js'; // Asegúrate de que la ruta sea correcta

const testConnection = async () => {
    try {
        await db.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

export default testConnection; // Esta línea es crucial
