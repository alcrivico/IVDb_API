const { DataTypes } = require("sequelize");
const database = require("./context/IVDatabase");
const User = require("./User");
const Videogame = require("./Videogame");

const Comment = database.define("comment", {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  hidden: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Comment.belongsTo(Rating, { foreignKey: "ratingId" });
Rating.hasMany(Comment, { foreignKey: "ratingId" });

module.exports = Comment;
