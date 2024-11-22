const { DataTypes } = require("sequelize");
const database = require("./context/IVDatabase");

const Developer = database.define("developer", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Developer;
