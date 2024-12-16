const request = require("supertest");
const database_test = require("../../models/context/IVDatabase_test");
const { server, server2 } = require("../../server_test");

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

  const userToken = await request(server2).post("/api/user/login").send({
    email: "diego@gmail.com",
    password: "diego",
  });

  token = userToken.header["x-token"];
});

const clearDumbData = async () => {};

afterAll(async () => {
  //await clearDumbData();
  await database_test.close();
});

describe("GET /api/videogame/single/:title/:releaseDate", () => {
  test("Debe obtener un videojuego existente", async () => {
    const response = await request(server2)
      .get("/api/videogame/single/Fortnite/2017-07-25")
      .set("x-token", token);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Fortnite");
  });

  test("Debe regresar un error 404 al buscar un videojuego inexistente", async () => {
    const response = await request(server2)
      .get("/api/videogame/single/Grand Theft Auto VI/2025-09-17")
      .set("x-token", token);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Videojuego no encontrado");
  });

  test("Debe regresar un error 500 al buscar un videojuego", async () => {
    jest.spyOn(VideogameDetailedViewModel, "findOne").mockImplementation(() => {
      throw new Error("Error al buscar el videojuego");
    });

    const response = await request(server2)
      .get("/api/videogame/single/Grand Theft Auto V/2013-09-17")
      .set("x-token", token);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("No se pudo obtener el videojuego");

    VideogameDetailedViewModel.findOne.mockRestore();
  });
});

describe("GET /api/videogame/group/:limit/:page/:filter", () => {
  test("Debe obtener un grupo de 8 videojuegos en orden Alfabético", async () => {
    const response = await request(server2)
      .get("/api/videogame/group/8/1/A-Z")
      .set("x-token", token);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(8);
    expect(response.body[0].title).toBe("Assassin's Creed");
    expect(response.body[7].title).toBe("The Witcher 3: Wild Hunt");
  });

  test("Debe obtener un grupo de 8 videojuegos en orden Alfabético Invertido", async () => {
    const response = await request(server2)
      .get("/api/videogame/group/8/1/Z-A")
      .set("x-token", token);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(8);
    expect(response.body[0].title).toBe("The Witcher 3: Wild Hunt");
    expect(response.body[7].title).toBe("Assassin's Creed");
  });

  test("Debe obtener un grupo de 8 videojuegos del más reciente al más antiguo", async () => {
    const response = await request(server2)
      .get("/api/videogame/group/8/1/MasRecientes")
      .set("x-token", token);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(8);
    expect(response.body[0].title).toBe("Fortnite");
    expect(response.body[7].title).toBe("Half-Life 2");
  });

  test("Debe obtener un grupo de 8 videojuegos del más antiguo al más reciente", async () => {
    const response = await request(server2)
      .get("/api/videogame/group/8/1/MasAntiguos")
      .set("x-token", token);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(8);
    expect(response.body[0].title).toBe("Half-Life 2");
    expect(response.body[7].title).toBe("Fortnite");
  });

  test("Debe obtener la pagina 2 de videojuegos estando vacia", async () => {
    const response = await request(server2)
      .get("/api/videogame/group/8/2/A-Z")
      .set("x-token", token);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Debe regresar un error 500 al buscar los videojuegos", async () => {
    jest.spyOn(VideogameDetailedViewModel, "findAll").mockImplementation(() => {
      throw new Error("Error al buscar los videojuegos");
    });

    const response = await request(server2)
      .get("/api/videogame/group/8/1/A-Z")
      .set("x-token", token);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("No se pudo obtener los videojuegos");

    VideogameDetailedViewModel.findAll.mockRestore();
  });
});

/*describe("GET /api/videogame/comment", () => {});

describe("GET /api/videogame/comments/critic", () => {});

describe("GET /api/videogame/comments/public", () => {});

describe("PATCH /api/videogame/comment/hide", () => {});

describe("POST /api/videogame/add", () => {});

describe("PUT /api/videogame/change", () => {});

describe("DELETE /api/videogame/delete", () => {});
*/
