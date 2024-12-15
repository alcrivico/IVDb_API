const { DataTypes } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const GenreModel = require("../../models/Genre");

beforeAll(async () => {
  await database_test.sync({ force: false });
});

afterAll(async () => {
  await database_test.close();
});
