import { Sequelize } from 'sequelize';

const db = new Sequelize('1281859bd4', '1281859', '12345', {
    host: '148.231.130.207', // o la dirección IP del servidor
    dialect: 'mariadb',
    port: 3306, // Asegúrate de que el puerto sea correcto
    dialectOptions: {
        connectTimeout: 30000 // Tiempo de espera en milisegundos
    }
});

export default db;
