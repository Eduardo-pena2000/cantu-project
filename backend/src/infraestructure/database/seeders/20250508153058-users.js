"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const users = [
      {
        id: 1,
        email: "admin@admin.com",
        password: "$2b$10$joXaVEYFNrkNfXiZ3bKhIuQZVOL6tms.v2gX7bk9CmuSC2a7gtjZa",
        username: "useradmin",
        names: "Administrador",
        last_names: "Plataforma",
        phone: "573222229886",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const roles = [{ user_id: 1, role_id: 1 }];

    await queryInterface.bulkInsert("users", users);
    await queryInterface.bulkInsert("user_roles", roles);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", {
      id: {
        [Sequelize.Op.in]: [1],
      },
    });
  },
};
