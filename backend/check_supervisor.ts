import { Sequelize, DataTypes } from "sequelize";
import { config } from "dotenv";
config();

const sequelize = new Sequelize(
    process.env.DB_NAME || "database_development",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "postgres",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "postgres",
        port: Number(process.env.DB_PORT) || 5432,
        logging: false,
    }
);

async function checkSupervisor() {
    try {
        await sequelize.authenticate();
        // Assuming 'supervisor' or similar username, or check by role.
        // Let's check all users with their roles.
        const [results] = await sequelize.query(`
      SELECT u.id, u.username, u.email, u.store_id, r.name as role_name
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE r.name ILIKE '%supervisor%'
    `);
        console.log("Supervisors:", JSON.stringify(results, null, 2));

        // Also check the specific mocked employees
        const [employees] = await sequelize.query("SELECT id, username, store_id FROM users WHERE id IN (1001, 1002, 1003, 1004, 1005)");
        console.log("Mock Employees:", JSON.stringify(employees, null, 2));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
    }
}

checkSupervisor();
