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
  realeseDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  imageRoute: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Videogame.belongsToMany(Platform, { through: "VideogamePlatforms" });
Platform.belongsToMany(Videogame, { through: "VideogamePlatforms" });

Videogame.belongsToMany(Genre, { through: "VideogameGenres" });
Genre.belongsToMany(Videogame, { through: "VideogameGenres" });

Videogame.belongsToMany(Developer, { through: "VideogameDevelopers" });
Developer.belongsToMany(Videogame, { through: "VideogameDevelopers" });

module.exports = Videogame;
