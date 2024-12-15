const { DataTypes } = require("sequelize");
const database = require("./context/IVDatabase_test");

const Genre = database.define("genre", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Genre;
