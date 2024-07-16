'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require("../../../database/connection");

class Grant extends Model { }
Grant.init({ 
      id:     {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1
    },       
    grant:          { type: DataTypes.STRING, allowNull: true },
    
    note:           { type: DataTypes.TEXT, allowNull: true },
    filterableRoute:{ type: DataTypes.STRING, allowNull: true, },
    route:          { type: DataTypes.STRING, allowNull: false }
}, {

  sequelize, modelName: 'grants',
  tableName: 'grants',
  underscored: true
});

module.exports = Grant;