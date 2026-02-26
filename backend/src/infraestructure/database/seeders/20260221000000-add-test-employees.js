"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Get the max user ID so we can insert new users seamlessly
        const [result] = await queryInterface.sequelize.query('SELECT max(id) as max_id FROM users;');
        let nextId = (result[0].max_id || 0) + 1;

        // 1.5 Get a valid Store ID to assign the employees to
        const [storeResult] = await queryInterface.sequelize.query('SELECT id FROM stores LIMIT 1;');
        if (!storeResult || storeResult.length === 0) {
            throw new Error("No stores found in the database. Please create a store first.");
        }
        const storeId = storeResult[0].id;

        // 2. Prepare 6 fake employees
        const users = [];
        const userRoles = [];
        const passwordHash = "$2b$10$joXaVEYFNrkNfXiZ3bKhIuQZVOL6tms.v2gX7bk9CmuSC2a7gtjZa"; // "123456"

        const firstNames = ["Carlos", "Maria", "Juan", "Ana", "Luis", "Elena"];
        const lastNames = ["Gomez", "Perez", "Rodriguez", "Hernandez", "Martinez", "Lopez"];

        for (let i = 0; i < 6; i++) {
            const currentId = nextId++;
            users.push({
                id: currentId,
                email: `empleado${i + 1}.test@cantu.com`,
                password: passwordHash,
                username: `empleado${i + 1}_test`,
                names: firstNames[i],
                last_names: lastNames[i],
                phone: `555123450${i}`,
                is_active: true,
                store_id: storeId, // Store ID requested dynamically from DB
                created_at: new Date(),
                updated_at: new Date(),
            });

            // Role ID 5 = Empleado
            userRoles.push({
                user_id: currentId,
                role_id: 5,
            });
        }

        // Insert Users
        await queryInterface.bulkInsert("users", users);
        // Insert their roles (Employee)
        await queryInterface.bulkInsert("user_roles", userRoles);

        // After explicitly inserting IDs, we must adjust PostgreSQL sequence
        await queryInterface.sequelize.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));`);
    },

    async down(queryInterface, Sequelize) {
        const emails = Array.from({ length: 6 }).map((_, i) => `empleado${i + 1}.test@cantu.com`);

        // Deleting them will cascade to user_roles due to foreign keys, but just in case we can just delete from users
        await queryInterface.bulkDelete("users", {
            email: {
                [Sequelize.Op.in]: emails,
            },
        });
    },
};
