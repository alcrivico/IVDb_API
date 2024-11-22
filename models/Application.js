const { DataTypes } = require("sequelize");
const database = require("./IVDatabase");

const Application = database.define("application", {
  request: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  requestDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Application;
