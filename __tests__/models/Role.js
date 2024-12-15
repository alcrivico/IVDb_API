const { DataTypes } = require("sequelize");
const database = require("./context/IVDatabase_test");

const Role = database.define("role", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Role;
