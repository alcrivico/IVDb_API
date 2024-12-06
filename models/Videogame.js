const { DataTypes } = require("sequelize");
const database = require("./context/IVDatabase");
const Platform = require("./Platform");
const Genre = require("./Genre");
const Developer = require("./Developer");

const Videogame = database.define("videogame", {
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
});

Videogame.belongsToMany(Platform, { through: "videogamePlatforms" });
Platform.belongsToMany(Videogame, { through: "videogamePlatforms" });

Videogame.belongsToMany(Genre, { through: "videogameGenres" });
Genre.belongsToMany(Videogame, { through: "videogameGenres" });

Videogame.belongsToMany(Developer, { through: "videogameDevelopers" });
Developer.belongsToMany(Videogame, { through: "videogameDevelopers" });

module.exports = Videogame;
