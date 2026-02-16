import { Sequelize } from "sequelize";
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

async function checkStores() {
    try {
        await sequelize.authenticate();
        const [results] = await sequelize.query("SELECT id, name FROM stores");
        console.log("Stores:", JSON.stringify(results, null, 2));
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
    }
}

checkStores();
