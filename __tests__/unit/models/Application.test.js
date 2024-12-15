const { DataTypes, Transaction } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const ApplicationModel = require("../../models/Application");

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
