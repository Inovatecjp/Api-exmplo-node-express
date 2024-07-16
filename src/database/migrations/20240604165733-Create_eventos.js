'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('eventos', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV1    
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      start:      { type: Sequelize.DataTypes.DATE },
      date:      { type: Sequelize.DataTypes.DATE },
      end:      { type: Sequelize.DataTypes.DATE },

      updated_at:      { type: Sequelize.DataTypes.DATE, allowNull: false },
      created_at:      { type: Sequelize.DataTypes.DATE, allowNull: false }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('eventos');

  }
};
