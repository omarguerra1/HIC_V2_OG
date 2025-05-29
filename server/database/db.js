import { Sequelize } from 'sequelize';

const db = new Sequelize('1281859bd4', '1281859', '12345', {
    host: '148.231.130.207', 
    dialect: 'mariadb',
    port: 3306, 
    dialectOptions: {
        connectTimeout: 30000 
    }
});

export default db;
