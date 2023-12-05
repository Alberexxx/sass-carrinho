'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'corTema', {
      type: Sequelize.STRING, // Novo tipo de dados
    }),
    await queryInterface.addColumn('usuarios', 'instagram', {
      type: Sequelize.STRING, // Novo tipo de dados
    }),
    await queryInterface.addColumn('usuarios', 'logo', {
      type: Sequelize.BLOB, // Novo tipo de dados
    });
  },

  async down (queryInterface, Sequelize) {
   
  }
};
