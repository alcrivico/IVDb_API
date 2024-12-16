const request = require("supertest");
const database_test = require("../../models/context/IVDatabase_test");
const Server = require("../../server");
const server = new Server().app;

const VideogameModel = require("../../models/Videogame");
const DeveloperModel = require("../../models/Developer");
const GenreModel = require("../../models/Genre");
const PlatformModel = require("../../models/Platform");
const UserModel = require("../../models/User");
const RoleModel = require("../../models/Role");
const RatingModel = require("../../models/Rating");
const CommentModel = require("../../models/Comment");
const VideogameDetailedViewModel = require("../../models/views/VideogameDetailedView");

beforeAll(async () => {
  await database_test.sync({ force: false });

  const userToken = await request(server).post("/api/user/login").send({
    email: "diego@gmail.com",
    password: "diego",
  });

  token = userToken.header["x-token"];
});

const clearDumbData = async () => {};

afterAll(async () => {
  await clearDumbData();
  await database_test.close();
});
