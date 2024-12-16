const request = require("supertest");
const database_test = require("../../models/context/IVDatabase_test");
const Server = require("../../../server");
const server = new Server().app;

const UserModel = require("../../models/User");
const RatingModel = require("../../models/Rating");
const ApplicationModel = require("../../models/Application");
const CommentModel = require("../../models/Comment");
const VideogameModel = require("../../models/Videogame");

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
