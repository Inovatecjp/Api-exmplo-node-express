'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('users', {
        id: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.DataTypes.UUIDV1    
        },
        cpf: {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
          unique: true

        },
        email: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        cargo: {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
        },
        password_hash: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        profiles_id: {
          type: Sequelize.DataTypes.UUID,
          references: { model: 'profiles', key: 'id' }
        },
        
        name: { type: Sequelize.DataTypes.STRING, allowNull: false },
        phone: { type: Sequelize.DataTypes.STRING, allowNull: true },
        birth_date: { type: Sequelize.DataTypes.DATEONLY, allowNull: true },
        updated_at: { type: Sequelize.DataTypes.DATE, allowNull: false },
        created_at: { type: Sequelize.DataTypes.DATE, allowNull: false },
        is_ativo:     { type: Sequelize.DataTypes.BOOLEAN, allowNull: false, default: true },

        passwordResetToken: { type: Sequelize.DataTypes.STRING },
        passwordResetExpires: { type: Sequelize.DataTypes.DATE },


      }, {underscored: true})
      .then(() => queryInterface.addIndex('users', ['profiles_id']))
      ;
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('users');
  }
};
