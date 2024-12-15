const { DataTypes } = require("sequelize");
const database = require("./context/IVDatabase_test");

const Platform = database.define("platform", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Platform;
