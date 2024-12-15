const { DataTypes } = require("sequelize");

const database_test = require("../../../models/context/IVDatabase_test");

const VideogameDetailedViewModel = require("../../../models/views/VideogameDetailedView");

beforeAll(async () => {
  await database_test.sync({ force: false });
});

afterAll(async () => {
  await database_test.close();
});
