const request = require("supertest");
const database_test = require("../../context/IVDatabase_test");
const Server = require("../../../server");
const server = new Server().app;

const VideogameModel = require("../../../models/Videogame");

beforeAll(async () => {
  await database_test.sync({ force: true });
});

afterAll(async () => {
  await database_test.close();
});
