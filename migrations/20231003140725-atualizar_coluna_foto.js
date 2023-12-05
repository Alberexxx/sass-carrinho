'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'mimetype', {
      type: Sequelize.STRING, // Novo tipo de dados
    }),
    await queryInterface.addColumn('products', 'originalname', {
      type: Sequelize.STRING, // Novo tipo de dados
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
