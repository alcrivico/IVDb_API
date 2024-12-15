const { Sequelize } = require("sequelize");

require("dotenv").config();

const database_test = new Sequelize(
  process.env.DB_NAME_TEST,
  process.env.DB_USER_TEST,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST_TEST,
    port: process.env.DB_PORT,
    define: {
      timestamps: false,
      freezeTableName: true,
    },
    dialect: "mysql",
  }
);

module.exports = database_test;
