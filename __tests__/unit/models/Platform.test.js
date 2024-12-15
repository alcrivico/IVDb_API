const { DataTypes } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const PlatformModel = require("../../models/Platform");

beforeAll(async () => {
  await database_test.sync({ force: true });
});

afterAll(async () => {
  await database_test.close();
});
