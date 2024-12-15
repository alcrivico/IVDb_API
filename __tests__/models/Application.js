const { DataTypes } = require("sequelize");
const database = require("./context/IVDatabase_test");

const Application = database.define("application", {
  request: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  requestDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  state: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Application;
