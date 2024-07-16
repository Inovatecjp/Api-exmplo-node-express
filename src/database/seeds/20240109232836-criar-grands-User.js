'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('grants', [
      { grant: 'post', route: '/users/cheking/', note: 'User comun fazer o cheking' },
      { grant: 'get,update,delete', route: '/users/', note: 'acesso as infos do proprio user' },
      { grant: 'get', route: '/users/plano/', note: 'pegar o plano do user' },
      { grant: 'get', route: '/users/treino/:id/', note: 'pegar o treino' },
      { grant: 'get', route: '/treino/:id/exercicios/', note: 'pegar todos os treinos por cateoria' },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('grants', null, {});
  }
};
