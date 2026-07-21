import { envs } from "../src/infraestructure/config/envs.config";
import { SequelizeDatabase } from "../src/infraestructure/database/sequelize";
import StoreModel from "../src/infraestructure/database/models/store.model";
import ShiftModel from "../src/infraestructure/database/models/shift.model";
import TeamModel from "../src/infraestructure/database/models/team.model";
import UserModel from "../src/infraestructure/database/models/user.model";
import RoleModel from "../src/infraestructure/database/models/role.model";
import UserRoleModel from "../src/infraestructure/database/models/user-role.model";
import TeamUserModel from "../src/infraestructure/database/models/team-user.model";
import TeamManagerModel from "../src/infraestructure/database/models/team-manager.model";

const hash = "$2b$10$y3m57Ayl3IUlYZybXD/77eVLum/RMnJ2RGm2OlZ5AbTe25GFlinQW"; // "admin123"

async function run() {
  console.log("Conectando a BD...");
  await SequelizeDatabase.connect({
    database: envs.DB_NAME,
    host: envs.DB_HOST,
    password: envs.DB_PASSWORD,
    port: envs.DB_PORT,
    username: envs.DB_USER,
  });
  console.log("BD Conectada.");

  // 1. Crear Tienda
  console.log("Creando tienda...");
  const store = await StoreModel.create({
    name: "Tienda Piloto",
    code: "PILOTO-01",
    address: "Av. Siempre Viva 123",
    municipality: "Monterrey",
    is_active: true,
  });

  // 2. Crear 2 Turnos
  console.log("Creando turnos...");
  const shiftMatutino = await ShiftModel.create({
    name: "Matutino Piloto",
    start_time: "08:00:00",
    end_time: "16:00:00",
  });
  
  const shiftVespertino = await ShiftModel.create({
    name: "Vespertino Piloto",
    start_time: "16:00:00",
    end_time: "23:59:00",
  });

  // 3. Crear 2 Equipos
  console.log("Creando equipos...");
  const teamMatutino = await TeamModel.create({
    name: "Equipo Mañana",
    store_id: store.id,
    shift_id: shiftMatutino.id,
  });

  const teamVespertino = await TeamModel.create({
    name: "Equipo Tarde",
    store_id: store.id,
    shift_id: shiftVespertino.id,
  });

  // 4. Crear Empleados (5 para Matutino, 5 para Vespertino)
  console.log("Creando 10 empleados...");
  
  const roles = await RoleModel.findAll();
  const employeeRole = roles.find(r => r.id === 5) || await RoleModel.create({ id: 5, name: "Empleado", slug: "employee" });
  const shiftManagerRole = roles.find(r => r.id === 4) || await RoleModel.create({ id: 4, name: "Encargado de turno", slug: "shift_manager" });

  let empCounter = 1;

  async function buildTeam(team, shiftName) {
    let managerId = null;
    
    for (let i = 0; i < 5; i++) {
      const isManager = i === 0; // The first one will be the manager
      const username = `emp_${shiftName}_${empCounter}`;
      
      const user = await UserModel.create({
        email: `${username}@cantu.com`,
        password: hash,
        username: username,
        names: isManager ? `Encargado ${empCounter}` : `Empleado ${empCounter}`,
        last_names: "Piloto",
        phone: `555000000${empCounter}`,
        store_id: store.id,
        is_active: true,
      });

      // Role assignment
      await UserRoleModel.create({
        user_id: user.id,
        role_id: isManager ? shiftManagerRole.id : employeeRole.id,
      });

      // Team assignment
      await TeamUserModel.create({
        user_id: user.id,
        team_id: team.id,
      });

      if (isManager) {
        managerId = user.id;
        await TeamManagerModel.create({
          user_id: user.id,
          team_id: team.id,
          is_main_manager: true,
        });
      }

      empCounter++;
    }
  }

  await buildTeam(teamMatutino, "matutino");
  await buildTeam(teamVespertino, "vespertino");

  console.log("¡Datos de prueba inyectados exitosamente!");
  process.exit(0);
}

run().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
