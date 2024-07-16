'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require("../../../database/connection");

class Profile extends Model { }
Profile.init({
  id: {
    type: DataTypes.UUID, allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1
  },
  name:         { type: DataTypes.STRING, allowNull: true },
  description:  { type: DataTypes.TEXT, allowNull: false, unique: true },
  isAdmin:      { type: DataTypes.BOOLEAN, allowNull: false, default: false }
}, {

        sequelize, 
        tableName: 'profiles',
        modelName: 'profile', 
        underscored: true
});

module.exports = Profile;