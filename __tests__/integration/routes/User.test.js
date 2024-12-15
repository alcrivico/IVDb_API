const request = require("supertest");
const database_test = require("../../models/context/IVDatabase_test");
const Server = require("../../../server");
const server = new Server().app;

const UserModel = require("../../models/User");

beforeAll(async () => {
  await database_test.sync({ force: true });
});

afterAll(async () => {
  await database_test.close();
});
