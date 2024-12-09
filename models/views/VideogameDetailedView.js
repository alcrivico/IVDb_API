const { DataTypes } = require("sequelize");
const database = require("../context/IVDatabase");

const VideogameDetailedView = database.define(
  "videogameDetailedView",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    imageRoute: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    developers: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    platforms: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    criticAvgRating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    publicAvgRating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sync: { force: false },
  }
);

module.exports = VideogameDetailedView;
