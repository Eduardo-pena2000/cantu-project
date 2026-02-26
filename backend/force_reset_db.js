const { Sequelize } = require('sequelize');
const { exec } = require('child_process');
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

async function forceReset() {
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa. Iniciando reseteo forzado...');

        // 1. Force Drop All Tables
        // Using CASCADE to ignore foreign key constraints during drop
        await sequelize.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
        console.log('✅ Esquema public recreado (Tablas eliminadas).');

        // 2. Run Migrations
        console.log('⏳ Ejecutando migraciones...');
        await runCommand('npx sequelize-cli db:migrate');
        console.log('✅ Migraciones completadas.');

        // 3. Run Seeds
        console.log('⏳ Ejecutando seeders...');
        await runCommand('npx sequelize-cli db:seed:all');
        console.log('✅ Seeders completados.');

        console.log('\n--- VERIFICACIÓN DE SUPERVISOR ---');
        const [results] = await sequelize.query("SELECT * FROM users WHERE email = 'supervisor@cantu.com'");
        if (results.length > 0) {
            console.log('✅ Supervisor encontrado en la base de datos recreada.');
        } else {
            console.error('❌ ALERTA: Supervisor NO encontrado después del reset.');
        }

    } catch (error) {
        console.error('❌ Error fatal durante el reset:', error);
    } finally {
        await sequelize.close();
    }
}

function runCommand(command) {
    return new Promise((resolve, reject) => {
        const process = exec(command, { cwd: __dirname });

        process.stdout.on('data', (data) => console.log(data.toString()));
        process.stderr.on('data', (data) => console.error(data.toString()));

        process.on('exit', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Comando falló con código ${code}`));
        });
    });
}

forceReset();
