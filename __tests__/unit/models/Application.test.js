const { DataTypes } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const ApplicationModel = require("../../models/Application");

beforeAll(async () => {
  await database_test.sync({ force: false });
});

afterAll(async () => {
  await ApplicationModel.destroy({ where: {} });
  await database_test.close();
});
