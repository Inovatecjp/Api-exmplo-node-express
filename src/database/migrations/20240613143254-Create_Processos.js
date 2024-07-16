'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const typeProcessos = [
      'comprar',
      'emisão'
    ]
    const typestatus = [
      'andamento',
      'finalizado',
      'arquivado'
    ]
    return queryInterface.createTable('processo', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV1    
      },

      titulo:      { type: Sequelize.DataTypes.STRING },
      descricao:      { type:Sequelize.DataTypes.TEXT },


      User_solicitante: {
        type: Sequelize.DataTypes.UUID,
        references: { model: 'users', key: 'id' }
      },
      User_atual: {
        type: Sequelize.DataTypes.UUID,
        references: { model: 'users', key: 'id' }
      },
      tipo_processo: {
        type: Sequelize.DataTypes.ENUM,
        values: typeProcessos, // Adicione os tipos de processo desejados aqui
        allowNull: false
      },
      status: {
        type: Sequelize.DataTypes.ENUM,
        values: typestatus, // Adicione os tipos de processo desejados aqui
        allowNull: false
      },




      updated_at:      { type: Sequelize.DataTypes.DATE, allowNull: false },
      created_at:      { type: Sequelize.DataTypes.DATE, allowNull: false }
    })
    .then(() => queryInterface.addIndex('processo', ['User_solicitante']))
    .then(() => queryInterface.addIndex('processo', ['User_atual']))
    ;
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('processo');

  }
};
