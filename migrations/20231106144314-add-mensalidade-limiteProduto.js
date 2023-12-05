'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'mensalidade', {
      type: Sequelize.STRING, // Novo tipo de dados
    }),
    await queryInterface.addColumn('usuarios', 'limite_produtos', {
      type: Sequelize.INTEGER, // Novo tipo de dados
    })
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
