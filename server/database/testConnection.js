import db from './db.js'; 

const testConnection = async () => {
    try {
        await db.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

export default testConnection; 
