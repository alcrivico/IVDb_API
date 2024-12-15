const { DataTypes } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const VideogameModel = require("../../models/Videogame");

beforeAll(async () => {
  await database_test.sync({ force: true });
});

afterAll(async () => {
  await database_test.close();
});
