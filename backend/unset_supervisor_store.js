
const { Sequelize } = require('sequelize');

// Load environment variables if necessary
require('dotenv').config();

// Database configuration
const sequelize = new Sequelize(
    process.env.DB_NAME || 'cantu_meat_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'password',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
    }
);

async function unsetSupervisorStore() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Supervisor User ID (from Previous Steps)
        const supervisorId = 1005;

        // Direct Update Query
        const [results, metadata] = await sequelize.query(
            `UPDATE users SET store_id = NULL WHERE id = ${supervisorId}`
        );

        console.log(`Supervisor (ID: ${supervisorId}) store_id set to NULL.`);

        await sequelize.close();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

unsetSupervisorStore();
