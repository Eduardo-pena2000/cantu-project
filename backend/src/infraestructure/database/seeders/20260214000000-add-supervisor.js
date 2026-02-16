"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Add Supervisor Role
        const roles = [
            {
                id: 7,
                name: "Supervisor",
                slug: "supervisor",
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];
        // Use upsert or ignore duplicates to be safe
        try {
            await queryInterface.bulkInsert("roles", roles);
        } catch (e) {
            console.log("Role might already exist, skipping...");
        }

        // 2. Add Supervisor User
        // Using the same hash as default admin (assuming it's '123456' or similar known dev password)
        // Hash: $2b$10$joXaVEYFNrkNfXiZ3bKhIuQZVOL6tms.v2gX7bk9CmuSC2a7gtjZa
        const users = [
            {
                id: 999, // High ID to avoid conflict
                email: "supervisor@cantu.com",
                password: "$2b$10$joXaVEYFNrkNfXiZ3bKhIuQZVOL6tms.v2gX7bk9CmuSC2a7gtjZa",
                username: "supervisor",
                names: "Supervisor",
                last_names: "General",
                phone: "5555555555",
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        try {
            await queryInterface.bulkInsert("users", users);
        } catch (e) {
            console.log("User might already exist, skipping...");
        }

        // 3. Assign Role
        const userRoles = [{ user_id: 999, role_id: 7 }];
        try {
            await queryInterface.bulkInsert("user_roles", userRoles);
        } catch (e) {
            console.log("UserRole might already exist, skipping...");
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("user_roles", { user_id: 999 });
        await queryInterface.bulkDelete("users", { id: 999 });
        await queryInterface.bulkDelete("roles", { id: 7 });
    },
};
