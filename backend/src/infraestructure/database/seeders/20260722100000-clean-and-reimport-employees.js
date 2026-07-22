"use strict";

const bcrypt = require("bcrypt");
const employeesData = require("./employees-cloudinary.json");

/**
 * Seeder DEFINITIVO: Limpia toda la basura y re-inserta solo los 66 empleados reales
 * con URLs permanentes de Cloudinary.
 * 
 * Este seeder:
 * 1. Borra TODOS los usuarios excepto Admin (id=1) y Supervisor (id=999)
 * 2. Borra las tiendas basura (GENERAL, pablo livas, Tienda Piloto)
 * 3. Crea las 5 tiendas reales (si no existen)
 * 4. Inserta los 66 empleados con fotos de Cloudinary
 * 5. Asigna roles correctos (Encargado de Tienda = 3, Empleado = 5)
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("\\n🧹 Paso 1: Limpiando datos basura...\\n");

    // Get IDs of users to KEEP (Admin and Supervisor)
    const protectedIds = [1, 999];

    // Delete ALL user relationships for non-protected users
    await queryInterface.sequelize.query(`
      DELETE FROM user_roles WHERE user_id NOT IN (${protectedIds.join(",")});
    `);
    await queryInterface.sequelize.query(`
      DELETE FROM team_users WHERE user_id NOT IN (${protectedIds.join(",")});
    `);
    await queryInterface.sequelize.query(`
      DELETE FROM team_managers WHERE user_id NOT IN (${protectedIds.join(",")});
    `);
    
    // Delete user devices for non-protected users
    try {
      await queryInterface.sequelize.query(`
        DELETE FROM user_devices WHERE user_id NOT IN (${protectedIds.join(",")});
      `);
    } catch (e) { /* table might not exist */ }

    // Delete assistance records for non-protected users
    try {
      await queryInterface.sequelize.query(`
        DELETE FROM activity_assignments WHERE assistance_id IN (
          SELECT id FROM assistance WHERE employee_id NOT IN (${protectedIds.join(",")})
        );
      `);
      await queryInterface.sequelize.query(`
        DELETE FROM assistance WHERE employee_id NOT IN (${protectedIds.join(",")});
      `);
    } catch (e) { /* tables might not exist */ }

    // Delete ALL non-protected users
    await queryInterface.sequelize.query(`
      DELETE FROM users WHERE id NOT IN (${protectedIds.join(",")});
    `);

    console.log("   ✅ Usuarios basura eliminados");

    // Delete junk stores
    const junkStores = ["GENERAL", "pablo livas", "Tienda Piloto"];
    for (const name of junkStores) {
      // Delete teams/shifts associated with junk stores
      try {
        await queryInterface.sequelize.query(`
          DELETE FROM teams WHERE store_id IN (SELECT id FROM stores WHERE name = '${name}');
        `);
        await queryInterface.sequelize.query(`
          DELETE FROM shifts WHERE store_id IN (SELECT id FROM stores WHERE name = '${name}');
        `);
      } catch (e) {}
      await queryInterface.sequelize.query(`DELETE FROM stores WHERE name = '${name}';`);
    }

    // Also delete store with id=1000 (Tienda Piloto from old seeder)
    try {
      await queryInterface.sequelize.query(`DELETE FROM teams WHERE store_id = 1000;`);
      await queryInterface.sequelize.query(`DELETE FROM shifts WHERE store_id = 1000;`);
      await queryInterface.sequelize.query(`DELETE FROM stores WHERE id = 1000;`);
    } catch(e) {}

    console.log("   ✅ Tiendas basura eliminadas\\n");

    // ─── Step 2: Create real stores ───
    console.log("🏪 Paso 2: Creando tiendas reales...\\n");

    const storeNames = [...new Set(employeesData.map(e => e.sucursal))];
    
    for (const name of storeNames) {
      const code = name.toUpperCase().replace(/\\s+/g, "_");
      const existing = await queryInterface.rawSelect('stores', {
        where: { name }
      }, ['id']);

      if (!existing) {
        await queryInterface.bulkInsert('stores', [{
          name,
          address: " ",
          code,
          address_detail: " ",
          suburb_name: " ",
          zip_code: " ",
          municipality: " ",
          created_at: new Date(),
          updated_at: new Date()
        }]);
        console.log(`   ✅ Tienda creada: ${name}`);
      } else {
        console.log(`   ⏭️  Tienda ya existe: ${name} (id=${existing})`);
      }
    }

    // Get store IDs
    const stores = await queryInterface.sequelize.query(
      `SELECT id, name FROM stores;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const storeMap = {};
    for (const s of stores) {
      storeMap[s.name] = s.id;
    }

    // ─── Step 3: Insert real employees ───
    console.log("\\n👥 Paso 3: Insertando 66 empleados reales...\\n");

    // Reset user sequence
    await queryInterface.sequelize.query(
      `SELECT setval('users_id_seq', COALESCE((SELECT MAX(id)+1 FROM users), 1), false);`
    );

    let inserted = 0;

    for (const emp of employeesData) {
      const storeId = storeMap[emp.sucursal];
      if (!storeId) {
        console.log(`   ❌ Tienda no encontrada: ${emp.sucursal} para ${emp.nombre}`);
        continue;
      }

      const isManager = emp.puesto.toUpperCase().includes("ENCARGAD");
      
      // Split name into first name and last names
      const nameParts = emp.nombre.split(" ");
      const firstName = nameParts[0] || " ";
      const lastName = nameParts.slice(1).join(" ") || " ";

      // Generate username from name
      const username = emp.nombre
        .toLowerCase()
        .replace(/\\s+/g, "")
        .substring(0, 20) + "_" + (inserted + 1);

      // Generate email
      let email = emp.email || `empleado_${inserted + 1}@cantu.com`;

      // Password: for managers use their lowercase name, for employees use a random password
      let plainPassword;
      if (isManager) {
        plainPassword = emp.nombre.toLowerCase().replace(/\\s+/g, "");
      } else {
        plainPassword = `cantu_${emp.nombre.toLowerCase().replace(/\\s+/g, "").substring(0, 8)}`;
      }
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Use Cloudinary URL (permanent) instead of Google Docs URL
      const avatarUrl = emp.cloudinaryUrl || null;

      // Insert user
      await queryInterface.bulkInsert('users', [{
        email,
        password: hashedPassword,
        username,
        names: firstName,
        last_names: lastName,
        phone: emp.phone || "0000000000",
        is_active: true,
        avatar_url: avatarUrl,
        store_id: storeId,
        created_at: new Date(),
        updated_at: new Date(),
      }]);

      // Get the inserted user's ID
      const [insertedUser] = await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE username = '${username}' LIMIT 1;`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      if (insertedUser) {
        // Assign role: 3 = Encargado de Tienda (store_manager), 5 = Empleado (employee)
        await queryInterface.bulkInsert('user_roles', [{
          user_id: insertedUser.id,
          role_id: isManager ? 3 : 5,
        }]);
      }

      inserted++;
      const photoIcon = avatarUrl ? "📷" : "🚫";
      const roleIcon = isManager ? "👑" : "👤";
      if (inserted % 10 === 0 || inserted === employeesData.length) {
        console.log(`   ${roleIcon} ${photoIcon} [${inserted}/${employeesData.length}] ${emp.nombre} → ${emp.sucursal}`);
      }
    }

    // Reset sequence after inserts
    await queryInterface.sequelize.query(
      `SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));`
    );

    console.log(`\\n✅ ¡Listo! ${inserted} empleados insertados con fotos permanentes de Cloudinary.\\n`);
  },

  async down(queryInterface, Sequelize) {
    // This seeder is meant to be permanent. No rollback.
    console.log("⚠️  Este seeder no tiene rollback. Los datos son permanentes.");
  }
};
