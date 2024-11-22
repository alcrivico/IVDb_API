const { DataTypes } = require("sequelize");
const database = require("./context/IVDatabase");

const Role = database.define("role", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Role;
