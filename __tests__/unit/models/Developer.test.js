const { DataTypes } = require("sequelize");

const database_test = require("../../context/IVDatabase_test");

const DeveloperModel = require("../../../models/Developer");

beforeAll(async () => {
  await database_test.sync({ force: true });
});

afterAll(async () => {
  await database_test.close();
});
