const { DataTypes } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const RatingModel = require("../../models/Rating");

beforeAll(async () => {
  await database_test.sync({ force: false });
});

afterAll(async () => {
  await RatingModel.destroy({ where: {} });
  await database_test.close();
});
