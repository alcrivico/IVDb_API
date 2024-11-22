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

User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });

User.hasOne(Application, { foreignKey: "userId" });
Application.belongsTo(User, { foreignKey: "userId" });

module.exports = User;
