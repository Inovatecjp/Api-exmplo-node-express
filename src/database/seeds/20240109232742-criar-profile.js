'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('profiles', [
      { name: 'diretor_presidente', description: 'Administrador geral', created_at: new Date(), updated_at: new Date()},
      { name: 'diretor_juridico', description: 'Administrador geral juridico', created_at: new Date(), updated_at: new Date()},
      { name: 'secretaria_geral', description: 'Secretaria geral', created_at: new Date(), updated_at: new Date()},
      { name: 'secretario', description: 'secretario', created_at: new Date(), updated_at: new Date()},
      { name: 'gerente_administrativo', description: 'gerente_administrativo', created_at: new Date(), updated_at: new Date()},
      { name: 'coordenador_projetos', description: 'coordenador_projetos', created_at: new Date(), updated_at: new Date()},
      { name: 'coordenador_TI', description: 'coordenador_TI', created_at: new Date(), updated_at: new Date()},
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('profiles', null, {});
  }
};
