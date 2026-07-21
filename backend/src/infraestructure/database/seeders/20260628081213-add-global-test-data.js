"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const hash = "$2b$10$y3m57Ayl3IUlYZybXD/77eVLum/RMnJ2RGm2OlZ5AbTe25GFlinQW"; // admin123

    // 1. Create Store
    await queryInterface.bulkInsert("stores", [
      {
        id: 1000,
        name: "Tienda Piloto",
        code: "PILOTO-01",
        address: "Av. Siempre Viva 123",
        suburb_name: "Centro",
        zip_code: "64000",
        municipality: "Monterrey",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // 2. Create Shifts
    await queryInterface.bulkInsert("shifts", [
      {
        id: 1000,
        name: "Matutino Piloto",
        store_id: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 1001,
        name: "Vespertino Piloto",
        store_id: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // 3. Create Teams
    await queryInterface.bulkInsert("teams", [
      {
        id: 1000,
        name: "Equipo Mañana",
        store_id: 1000,
        shift_id: 1000,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 1001,
        name: "Equipo Tarde",
        store_id: 1000,
        shift_id: 1001,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Ensure we have Employee (5) and Shift Manager (4) roles
    try {
      await queryInterface.bulkInsert("roles", [
        { id: 4, name: "Encargado de turno", slug: "shift_manager", created_at: new Date(), updated_at: new Date() },
        { id: 5, name: "Empleado", slug: "employee", created_at: new Date(), updated_at: new Date() }
      ]);
    } catch(e) {} // Ignore if they already exist

    // 4. Create Users (10 total, 5 per shift)
    const users = [];
    const userRoles = [];
    const teamUsers = [];
    const teamManagers = [];

    let userId = 10000;
    
    // Team 1: Matutino
    for (let i = 0; i < 5; i++) {
      const isManager = i === 0;
      users.push({
        id: userId,
        email: `emp_matutino_${i+1}@cantu.com`,
        password: hash,
        username: `emp_matutino_${i+1}`,
        names: isManager ? `Encargado Matutino` : `Empleado M-${i+1}`,
        last_names: "Piloto",
        phone: `555000100${i}`,
        store_id: 1000,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });
      userRoles.push({ user_id: userId, role_id: isManager ? 4 : 5 });
      teamUsers.push({ user_id: userId, team_id: 1000, created_at: new Date(), updated_at: new Date() });
      if (isManager) {
        teamManagers.push({ user_id: userId, team_id: 1000, is_main_manager: true, created_at: new Date(), updated_at: new Date() });
      }
      userId++;
    }

    // Team 2: Vespertino
    for (let i = 0; i < 5; i++) {
      const isManager = i === 0;
      users.push({
        id: userId,
        email: `emp_vespertino_${i+1}@cantu.com`,
        password: hash,
        username: `emp_vespertino_${i+1}`,
        names: isManager ? `Encargado Vespertino` : `Empleado V-${i+1}`,
        last_names: "Piloto",
        phone: `555000200${i}`,
        store_id: 1000,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });
      userRoles.push({ user_id: userId, role_id: isManager ? 4 : 5 });
      teamUsers.push({ user_id: userId, team_id: 1001, created_at: new Date(), updated_at: new Date() });
      if (isManager) {
        teamManagers.push({ user_id: userId, team_id: 1001, is_main_manager: true, created_at: new Date(), updated_at: new Date() });
      }
      userId++;
    }

    await queryInterface.bulkInsert("users", users);
    await queryInterface.bulkInsert("user_roles", userRoles);
    await queryInterface.bulkInsert("team_users", teamUsers);
    await queryInterface.bulkInsert("team_managers", teamManagers);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("team_managers", { team_id: { [Sequelize.Op.in]: [1000, 1001] } });
    await queryInterface.bulkDelete("team_users", { team_id: { [Sequelize.Op.in]: [1000, 1001] } });
    await queryInterface.bulkDelete("user_roles", { user_id: { [Sequelize.Op.gte]: 10000 } });
    await queryInterface.bulkDelete("users", { id: { [Sequelize.Op.gte]: 10000 } });
    await queryInterface.bulkDelete("teams", { id: { [Sequelize.Op.in]: [1000, 1001] } });
    await queryInterface.bulkDelete("shifts", { id: { [Sequelize.Op.in]: [1000, 1001] } });
    await queryInterface.bulkDelete("stores", { id: 1000 });
  },
};
