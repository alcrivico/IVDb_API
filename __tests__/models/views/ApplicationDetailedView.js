const { DataTypes } = require("sequelize");
const database = require("../context/IVDatabase_test");

const ApplicationDetailedView = database.define(
  "applicationDetailedView",
  {
    request: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    state: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sync: { force: false },
  }
);

module.exports = ApplicationDetailedView;
