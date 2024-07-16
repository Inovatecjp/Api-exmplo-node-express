'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require("../../../database/connection");


class ProfileGrant extends Model { }
ProfileGrant.init({
    id: {
        type: DataTypes.UUID, allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1
    },
    status: { type: DataTypes.STRING, allowNull: true },
    }, { sequelize, modelName: 'profile_grant', tableName: 'profile_grant', underscored: true }
);

module.exports = ProfileGrant;