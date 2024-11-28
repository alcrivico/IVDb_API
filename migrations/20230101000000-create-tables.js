"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const database = require("../models/context/IVDatabase");
    const User = require("../models/User");
    const Role = require("../models/Role");
    const Application = require("../models/Application");
    const Comment = require("../models/Comment");
    const Developer = require("../models/Developer");
    const Genre = require("../models/Genre");
    const Platform = require("../models/Platform");
    const Rating = require("../models/Rating");
    const Videogame = require("../models/Videogame");

    await queryInterface.sequelize.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );

    await queryInterface.sequelize.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME_TEST}\`;`
    );

    await database.sync();
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropAllTables();
  },
};
