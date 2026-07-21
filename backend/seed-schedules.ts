import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "stores_db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "postgres",
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    dialect: "postgres",
    logging: false,
  }
);

async function run() {
  const queryInterface = sequelize.getQueryInterface();
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  
  const schedules = [];
  const userSchedules = [];
  
  let scheduleId = 1000;
  
  for (let i = 0; i < 7; i++) {
    // Matutino (Shift ID: 1000) -> 08:00 to 16:00
    schedules.push({
      id: scheduleId,
      day: days[i],
      week_day: i,
      is_weekend: i === 0 || i === 6,
      start_time: "08:00",
      end_time: "16:00",
      shift_id: 1000,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Link users 10000 - 10004
    for (let u = 10000; u <= 10004; u++) {
      userSchedules.push({
        user_id: u,
        schedule_id: scheduleId,
        team_id: 1000,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    scheduleId++;
    
    // Vespertino (Shift ID: 1001) -> 16:00 to 08:00
    schedules.push({
      id: scheduleId,
      day: days[i],
      week_day: i,
      is_weekend: i === 0 || i === 6,
      start_time: "16:00",
      end_time: "08:00",
      shift_id: 1001,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Link users 10005 - 10009
    for (let u = 10005; u <= 10009; u++) {
      userSchedules.push({
        user_id: u,
        schedule_id: scheduleId,
        team_id: 1001,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    scheduleId++;
  }
  
  // Clear existing just in case
  await queryInterface.bulkDelete("user_shifts_schedules", {});
  await queryInterface.bulkDelete("shift_schedules", {});
  
  await queryInterface.bulkInsert("shift_schedules", schedules);
  await queryInterface.bulkInsert("user_shifts_schedules", userSchedules);
  
  console.log("Schedules inserted successfully!");
  process.exit(0);
}

run().catch(console.error);
