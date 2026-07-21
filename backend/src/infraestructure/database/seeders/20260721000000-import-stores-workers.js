"use strict";

const bcrypt = require("bcrypt");
const employeesData = require("./employees.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create stores
    const storeNames = [...new Set(employeesData.map(e => e.sucursal))];
    const storesToInsert = storeNames.map(name => {
      // General format code
      const code = name.toUpperCase().replace(/\s+/g, "_");
      return {
        name: name,
        address: " ",
        code: code,
        address_detail: " ",
        suburb_name: " ",
        zip_code: " ",
        municipality: " ",
        created_at: new Date(),
        updated_at: new Date()
      };
    });

    // Sync store sequence just in case
    await queryInterface.sequelize.query(`SELECT setval('stores_id_seq', COALESCE((SELECT MAX(id)+1 FROM stores), 1), false);`);

    // Insert stores if they don't exist
    for (const store of storesToInsert) {
      const existing = await queryInterface.rawSelect('stores', {
        where: { name: store.name }
      }, ['id']);
      
      if (!existing) {
        await queryInterface.bulkInsert('stores', [store]);
      }
    }

    // Get store IDs mapped by name
    const insertedStores = await queryInterface.sequelize.query(
      `SELECT id, name FROM stores;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const storeMap = {};
    for (const s of insertedStores) {
      storeMap[s.name] = s.id;
    }

    // 2. Process users
    const usersToInsert = [];
    let dummyCounter = 1;

    for (const emp of employeesData) {
      const store_id = storeMap[emp.sucursal];
      
      // Determine if manager
      const isManager = emp.puesto.toUpperCase().includes("ENCARGAD");
      
      // Passwords and Emails
      let plainPassword = "";
      let email = "";
      let username = emp.nombre.toLowerCase().replace(/\s+/g, "").substring(0, 20); // max username length?

      if (isManager) {
        plainPassword = emp.nombre.toLowerCase().replace(/\s+/g, "");
        email = emp.email || `encargado_${dummyCounter}@cantu.com`; // fallback just in case
      } else {
        plainPassword = `cantu_${Math.random().toString(36).slice(-8)}`;
        email = emp.email || `empleado_${dummyCounter}@cantu.com`;
      }
      
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      
      // Split names
      const nameParts = emp.nombre.split(" ");
      const firstName = nameParts[0] || " ";
      const lastName = nameParts.slice(1).join(" ") || " ";
      
      // Avatar
      const avatar_url = emp.photoUrl || null;
      
      usersToInsert.push({
        email: email,
        password: hashedPassword,
        username: username + dummyCounter, // ensuring uniqueness
        names: firstName,
        last_names: lastName,
        phone: emp.phone || "0000000000",
        is_active: true,
        avatar_url: avatar_url,
        store_id: store_id,
        created_at: new Date(),
        updated_at: new Date(),
        // metadata to help us link roles later
        _isManager: isManager
      });
      
      dummyCounter++;
    }

    // Insert Users
    // Remove the _isManager field before insert, but we need it for user_roles mapping.
    // So we'll insert one by one or get IDs after.
    // Since usernames are unique (we appended dummyCounter), we can insert them and query them back.
    const usersForDb = usersToInsert.map(u => {
      const dbUser = { ...u };
      delete dbUser._isManager;
      return dbUser;
    });

    // Sync user sequence just in case
    await queryInterface.sequelize.query(`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id)+1 FROM users), 1), false);`);

    await queryInterface.bulkInsert('users', usersForDb);

    // 3. Link roles
    const insertedUsers = await queryInterface.sequelize.query(
      `SELECT id, username FROM users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    // We know roles: 3 = Director Tienda (store_manager), 5 = Empleado (employee)
    const userRoles = [];
    
    for (const u of usersToInsert) {
      const dbRecord = insertedUsers.find(dbU => dbU.username === u.username);
      if (dbRecord) {
        userRoles.push({
          user_id: dbRecord.id,
          role_id: u._isManager ? 3 : 5
        });
      }
    }

    // Sync user_roles sequence if it exists, but typically through tables don't need sequences if they have auto increments, just in case:
    try {
      await queryInterface.sequelize.query(`SELECT setval('user_roles_id_seq', COALESCE((SELECT MAX(id)+1 FROM user_roles), 1), false);`);
    } catch (e) {} // ignore if no sequence

    if (userRoles.length > 0) {
      await queryInterface.bulkInsert('user_roles', userRoles);
    }
  },

  async down(queryInterface, Sequelize) {
    // Basic cleanup logic could go here, but this is an import script
  }
};
