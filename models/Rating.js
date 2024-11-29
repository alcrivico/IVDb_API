const { DataTypes } = require("sequelize");
const database = require("./context/IVDatabase");
const User = require("./User");
const Videogame = require("./Videogame");

const Rating = database.define("rating", {
  rate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

Rating.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });
User.hasMany(Rating, { foreignKey: { name: "userId", allowNull: false } });

Rating.belongsTo(Videogame, {
  foreignKey: { name: "videogameId", allowNull: false },
});
Videogame.hasMany(Rating, {
  foreignKey: { name: "videogameId", allowNull: false },
});

module.exports = Rating;
