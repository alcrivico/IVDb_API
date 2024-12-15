const { DataTypes } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const RoleModel = require("../../models/Role");

beforeAll(async () => {
  await database_test.sync({ force: false });
});

afterAll(async () => {
  await database_test.close();
});
