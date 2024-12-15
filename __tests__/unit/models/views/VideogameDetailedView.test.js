const { DataTypes, Transaction } = require("sequelize");

const database_test = require("../../../models/context/IVDatabase_test");

const VideogameDetailedViewModel = require("../../../models/views/VideogameDetailedView");

let transaction;

beforeAll(async () => {
  await database_test.sync({ force: false });
});

beforeEach(async () => {
  transaction = await database_test.transaction();
});

afterEach(async () => {
  await transaction.rollback();
});

afterAll(async () => {
  await database_test.close();
});
