const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'cantu_meat_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'password',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
    }
);

async function getShiftManagers() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Role ID for Shift Manager is 4
        const shiftManagerRoleId = 4;

        const [results, metadata] = await sequelize.query(
            `SELECT u.id, u.names, u.last_names, u.email, s.name as store_name
             FROM users u
             JOIN user_roles ur ON u.id = ur.user_id
             LEFT JOIN stores s ON u.store_id = s.id
             WHERE ur.role_id = $1`,
            {
                bind: [shiftManagerRoleId],
            }
        );

        console.log('\n--- Encargados de Turno (Shift Managers) ---\n');
        if (results.length > 0) {
            results.forEach(user => {
                console.log(`ID: ${user.id} | Nombre: ${user.names} ${user.last_names} | Email: ${user.email} | Tienda: ${user.store_name || 'Sin asignar'}`);
            });
        } else {
            console.log('No se encontraron encargados de turno.');
        }
        console.log('\n--------------------------------------------\n');

        await sequelize.close();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

getShiftManagers();
