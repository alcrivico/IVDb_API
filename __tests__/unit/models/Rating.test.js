const { DataTypes } = require("sequelize");

const database_test = require("../../context/IVDatabase_test");

const RatingModel = require("../../../models/Rating");

beforeAll(async () => {
  await database_test.sync({ force: true });
});

afterAll(async () => {
  await database_test.close();
});
