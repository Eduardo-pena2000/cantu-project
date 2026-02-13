"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const roles = [
      {
        id: 1,
        name: "Administrador",
        slug: "admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "Director General",
        slug: "general_manager",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: "Director Tienda",
        slug: "store_manager",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: "Director Turno",
        slug: "shift_manager",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        name: "Empleado",
        slug: "employee",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert("roles", roles);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", {
      id: {
        [Sequelize.Op.in]: [1, 2, 3, 4, 5],
      },
    });
  },
};
