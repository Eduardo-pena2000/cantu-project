"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Buscar la tienda "GENERAL"
    const store = await queryInterface.rawSelect('stores', {
      where: { name: 'GENERAL' }
    }, ['id']);

    if (store) {
      // Obtener los usuarios de esa tienda
      const users = await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE store_id = :storeId;`,
        { 
          replacements: { storeId: store },
          type: Sequelize.QueryTypes.SELECT 
        }
      );

      const userIds = users.map(u => u.id);

      if (userIds.length > 0) {
        // Eliminar roles y relaciones
        await queryInterface.bulkDelete('user_roles', { user_id: { [Sequelize.Op.in]: userIds } });
        await queryInterface.bulkDelete('team_users', { user_id: { [Sequelize.Op.in]: userIds } });
        await queryInterface.bulkDelete('team_managers', { user_id: { [Sequelize.Op.in]: userIds } });
        await queryInterface.bulkDelete('user_devices', { user_id: { [Sequelize.Op.in]: userIds } });
        await queryInterface.bulkDelete('assistance', { employee_id: { [Sequelize.Op.in]: userIds } });
        
        // Eliminar usuarios
        await queryInterface.bulkDelete('users', { id: { [Sequelize.Op.in]: userIds } });
      }

      // Eliminar tienda
      await queryInterface.bulkDelete('stores', { id: store });
    }
  },

  async down(queryInterface, Sequelize) {
    // No-op
  }
};
