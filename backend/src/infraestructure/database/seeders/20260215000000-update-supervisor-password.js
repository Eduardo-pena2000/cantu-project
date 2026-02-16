"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const passwordHash = "$2b$10$3zQH2Ghomv.hqG1RGjBMYuN5j/GhRobsJMw5IM7JfbLw499bC.2oS"; // 'usersupervisor'

        // Update password for user with ID 999 (Supervisor)
        // We can use bulkUpdate but it's not standard in Sequelize CLI migrations cleanly without model definitions sometimes.
        // Using raw query is safer if we just want to execute SQL

        return queryInterface.sequelize.query(
            `UPDATE users SET password = '${passwordHash}' WHERE id = 999;`
        );
    },

    async down(queryInterface, Sequelize) {
        // Revert to old hash if needed (but we destroyed it, so maybe just leave it or revert to a default known hash)
        // Let's assume we don't need strict down migration for password resets in dev.
    },
};
