require('dotenv').config();
const { Sequelize } = require('sequelize');
console.log(process.env.DATABASE_HOST)
module.exports = {
  /* SQLite */
  // dialect: 'sqlite',
  // storage: './db.sqlite',

  /* MySQL / MariaDB */
  dialect: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
  },  
  // dialectOptions: {
  //   timezone: 'America/Sao_Paulo',
  // },
  // timezone: 'America/Sao_Paulo',

  /* ALL */
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
  },
};
