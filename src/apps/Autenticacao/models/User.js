"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../database/connection");
const bcryptjs = require("bcryptjs");

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "",
    },

    email: {
      type: DataTypes.STRING,
      defaultValue: "",
      unique: {
        msg: "Email já existe",
      },
      validate: {
        isEmail: {
          msg: "Email inválido",
        },
      },
    },
    profiles_id: {
      type: DataTypes.UUID,
      references: { model: "profiles", key: "id" },
    },
    cpf: { type: DataTypes.STRING, unique: true },
    birthDate: { type: DataTypes.DATEONLY },
    phone: { type: DataTypes.STRING },
    is_ativo: { type: DataTypes.BOOLEAN, allowNull: false, default: true },
    password_hash: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    password: {
      type: DataTypes.VIRTUAL,
      defaultValue: "",
    },
  },
  {
    hooks: {
      beforeSave:async (user, options) => {
        if (user.password !== undefined)
          user.password_hash = await bcryptjs.hash(user.password, 10);
      },
      beforeCreate: async (user, options) => {
        if (user.password !== undefined)
          user.password_hash = await bcryptjs.hash(user.password, 10);
      },
    },
    sequelize: sequelize,
    modelName: "users",
    underscored: true,
  }
);

User.prototype.validPassword = async function (password) {
  return bcryptjs.compareSync(password, this.password_hash);
};

module.exports = User;
