const { DataTypes } = require("sequelize");
const database = require("./context/IVDatabase");
const Role = require("./Role");
const Application = require("./Application");

const User = database.define("user", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.belongsTo(Role, { foreignKey: { name: "roleId", allowNull: false } });
Role.hasMany(User, { foreignKey: { name: "roleId", allowNull: false } });

User.hasOne(Application, { foreignKey: { name: "userId", allowNull: false } });
Application.belongsTo(User, {
  foreignKey: { name: "userId", allowNull: false },
});

module.exports = User;
