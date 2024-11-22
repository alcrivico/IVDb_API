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

Rating.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Rating, { foreignKey: "userId" });

Rating.belongsTo(Videogame, { foreignKey: "videogameId" });
Videogame.hasMany(Rating, { foreignKey: "videogameId" });

module.exports = Rating;
