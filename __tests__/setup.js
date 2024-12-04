const database = require("./context/IVDatabase_test");

beforeAll(async () => {
  await database.sync({ force: true });
});

afterAll(async () => {
  await database.close();
});
