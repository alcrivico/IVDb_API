const request = require("supertest");
const { Op } = require("sequelize");
const database_test = require("../../models/context/IVDatabase_test");
const Server = require("../../server");
const server = new Server().app;

const UserModel = require("../../models/User");
const RatingModel = require("../../models/Rating");
const ApplicationModel = require("../../models/Application");
const CommentModel = require("../../models/Comment");
const VideogameModel = require("../../models/Videogame");
const Rating = require("../../models/Rating");

beforeAll(async () => {
  await database_test.sync({ force: false });

  const userToken = await request(server).post("/api/user/login").send({
    email: "diego@gmail.com",
    password: "diego",
  });

  token = userToken.header["x-token"];
});

beforeEach(async () => {
  transaction = await database_test.transaction();
});

afterEach(async () => {
  await transaction.rollback();
});

const clearDumbData = async () => {
  await ApplicationModel.destroy({
    where: {
      request: "Quiero ser critico experto en juegos de accion-aventura",
    },
  });

  await ApplicationModel.destroy({
    where: {
      request: "Quiero ser critico de juegos de rockstar",
    },
  });

  await ApplicationModel.destroy({
    where: {
      request: "Quiero ser critico de nintendo y rockstar",
    },
  });

  const videogame1 = await VideogameModel.findOne({
    where: { title: "Game1" },
  });

  const user10 = await UserModel.findOne({
    where: { email: "user10@example.com" },
  });

  await RatingModel.destroy({
    where: {
      [Op.and]: [{ videogameId: videogame1.id }, { userId: user10.id }],
    },
  });

  const videogame2 = await VideogameModel.findOne({
    where: { title: "Game2" },
  });

  const user12 = await UserModel.findOne({
    where: { email: "user12@example.com" },
  });

  const rating2 = await RatingModel.findOne({
    where: {
      [Op.and]: [{ videogameId: videogame2.id }, { userId: user12.id }],
    },
  });

  await CommentModel.destroy({
    where: { ratingId: rating2.id },
  });

  await RatingModel.destroy({
    where: {
      [Op.and]: [{ videogameId: videogame2.id }, { userId: user12.id }],
    },
  });

  await VideogameModel.destroy({
    where: { title: "Game1" },
  });

  await VideogameModel.destroy({
    where: { title: "Game2" },
  });

  await VideogameModel.destroy({
    where: { title: "Game3" },
  });

  await UserModel.destroy({
    where: { email: "user2@example.com" },
  });

  await UserModel.destroy({
    where: { email: "user4@example.com" },
  });

  await UserModel.destroy({
    where: { email: "user6@example.com" },
  });

  await UserModel.destroy({
    where: { email: "user7@example.com" },
  });

  await UserModel.destroy({
    where: { email: "user71@example.com" },
  });

  await UserModel.destroy({
    where: { email: "user8@example.com" },
  });

  await UserModel.destroy({
    where: { email: "user9@example.com" },
  });

  await UserModel.destroy({
    where: { email: "user10@example.com" },
  });

  await UserModel.destroy({
    where: { email: "user11@example.com" },
  });

  await UserModel.destroy({
    where: { email: "user12@example.com" },
  });

  await UserModel.destroy({
    where: { email: "user13@example.com" },
  });

  await UserModel.destroy({
    where: { email: "user14@example.com" },
  });
};

afterAll(async () => {
  await clearDumbData();
  await database_test.close();
});

describe("GET /api/user/", () => {
  test("Debe obtener un usuario existente", async () => {
    const response = await request(server)
      .get("/api/user/")
      .set("x-token", token)
      .send({ email: "diego@gmail.com", password: "diego" });

    expect(response.status).toBe(200);
    expect(response.body.email).toBe("diego@gmail.com");
  });

  test("Debe retornar 404 si el usuario no existe", async () => {
    const response = await request(server)
      .get("/api/user/")
      .set("x-token", token)
      .send({ email: "nonexistent@example.com", password: "password" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado");
  });

  test("Debe retornar 500 si hay un error en el servidor", async () => {
    jest.spyOn(UserModel, "findOne").mockImplementation(() => {
      throw new Error("Error en el servidor");
    });

    const response = await request(server)
      .get("/api/user/")
      .set("x-token", token)
      .send({ email: "diego@gmail.com", password: "diego" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("No se pudo obtener el usuario");

    UserModel.findOne.mockRestore();
  });
});

describe("POST /api/user/signup", () => {
  test("Debe crear un nuevo usuario", async () => {
    const response = await request(server).post("/api/user/signup").send({
      username: "User2",
      email: "user2@example.com",
      password: "password2",
    });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe("user2@example.com");
  });

  test("Debe retornar 400 si hay un error", async () => {
    jest.spyOn(UserModel, "create").mockImplementation(() => {
      throw new Error("Error en el servidor");
    });

    const response = await request(server).post("/api/user/signup").send({
      username: "User4",
      email: "user4@example.com",
      password: "password4",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No se pudo crear el usuario");

    UserModel.create.mockRestore();
  });
});

describe("POST /api/user/login", () => {
  test("Debe iniciar sesión correctamente", async () => {
    const response = await request(server)
      .post("/api/user/login")
      .send({ email: "victoria@gmail.com", password: "victoria" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`Bienvenido Victoria`);
  });

  test("Debe retornar 401 si las credenciales son incorrectas", async () => {
    const response = await request(server)
      .post("/api/user/login")
      .send({ email: "user5@example.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Usuario y/o contraseña incorrectos");
  });

  test("Debe retornar 500 si hay un error en el servidor", async () => {
    jest.spyOn(UserModel, "findOne").mockImplementation(() => {
      throw new Error("Error en el servidor");
    });

    const user = await UserModel.create({
      username: "User4",
      email: "user4@example.com",
      password: "password4",
    });

    const response = await request(server)
      .post("/api/user/login")
      .set("x-token", token)
      .send({ email: "user4@example.com", password: "password4" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("No se pudo iniciar sesión");

    UserModel.findOne.mockRestore();
  });
});

describe("POST /api/user/application", () => {
  test("Debe crear una nueva solicitud", async () => {
    const user = await UserModel.create({
      username: "User6",
      email: "user6@example.com",
      password: "password6",
    });

    const response = await request(server)
      .post("/api/user/application")
      .set("x-token", token)
      .send({
        email: "user6@example.com",
        request: "Quiero ser critico experto en juegos de accion-aventura",
      });

    expect(response.status).toBe(201);
    expect(response.body.request).toBe(
      "Quiero ser critico experto en juegos de accion-aventura"
    );
  });

  test("Debe retornar 404 si el usuario no existe", async () => {
    const response = await request(server)
      .post("/api/user/application")
      .set("x-token", token)
      .send({
        email: "nonexistent@example.com",
        request: "Quiero ser critico",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado");
  });

  test("Debe retornar 500 si hay un error en el servidor", async () => {
    jest.spyOn(ApplicationModel, "findOne").mockImplementation(() => {
      throw new Error("Error en el servidor");
    });

    const response = await request(server)
      .post("/api/user/application")
      .set("x-token", token)
      .send({ email: "user6@example.com", request: "Quiero ser critico" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("No se pudo crear la solicitud");

    ApplicationModel.findOne.mockRestore();
  });
});

describe("GET /api/user/applications", () => {
  test("Debe obtener todas las solicitudes", async () => {
    const response = await request(server)
      .get("/api/user/applications")
      .set("x-token", token);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Debe retornar 500 si hay un error en el servidor", async () => {
    jest.spyOn(ApplicationModel, "findAll").mockImplementation(() => {
      throw new Error("Error en el servidor");
    });

    const response = await request(server)
      .get("/api/user/applications")
      .set("x-token", token);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "No se pudieron obtener las solicitudes"
    );

    ApplicationModel.findAll.mockRestore();
  });
});

describe("GET /api/user/application", () => {
  test("Debe obtener una solicitud existente", async () => {
    const user = await UserModel.create({
      username: "User7",
      email: "user7@example.com",
      password: "password7",
    });

    const application = await ApplicationModel.create({
      request: "Quiero ser critico de juegos de rockstar",
      requestDate: new Date(),
      state: false,
      userId: user.id,
    });

    const response = await request(server)
      .get("/api/user/application")
      .set("x-token", token)
      .send({ email: "user7@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.request).toBe(
      "Quiero ser critico de juegos de rockstar"
    );
  });

  test("Debe retornar 404 si la solicitud no existe", async () => {
    const user = await UserModel.create({
      username: "User71",
      email: "user71@example.com",
      password: "password71",
    });

    const response = await request(server)
      .get("/api/user/application")
      .set("x-token", token)
      .send({ email: "user71@example.com" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Solicitud no encontrada");
  });

  test("Debe retornar 500 si hay un error en el servidor", async () => {
    jest.spyOn(ApplicationModel, "findOne").mockImplementation(() => {
      throw new Error("Error en el servidor");
    });

    const response = await request(server)
      .get("/api/user/application")
      .set("x-token", token)
      .send({ email: "user7@example.com" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("No se pudo obtener la solicitud");

    ApplicationModel.findOne.mockRestore();
  });
});

describe("PATCH /api/user/application", () => {
  test("Debe actualizar una solicitud existente", async () => {
    const user = await UserModel.create({
      username: "User8",
      email: "user8@example.com",
      password: "password8",
    });

    const application = await ApplicationModel.create({
      request: "Quiero ser critico de nintendo",
      requestDate: new Date(),
      state: false,
      userId: user.id,
    });

    const response = await request(server)
      .patch("/api/user/application")
      .set("x-token", token)
      .send({
        email: "user8@example.com",
        request: "Quiero ser critico de nintendo y rockstar",
      });

    expect(response.status).toBe(200);
    expect(response.body.request).toBe(
      "Quiero ser critico de nintendo y rockstar"
    );
  });

  test("Debe retornar 404 si la solicitud no existe", async () => {
    const response = await request(server)
      .patch("/api/user/application")
      .set("x-token", token)
      .send({
        email: "nonexistent@example.com",
        request: "Quiero ser critico",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado");
  });

  test("Debe retornar 500 si hay un error en el servidor", async () => {
    jest.spyOn(ApplicationModel, "findOne").mockImplementation(() => {
      throw new Error("Error en el servidor");
    });

    const response = await request(server)
      .patch("/api/user/application")
      .set("x-token", token)
      .send({
        email: "user8@example.com",
        request: "Quiero ser critico",
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("No se pudo actualizar la solicitud");

    ApplicationModel.findOne.mockRestore();
  });
});

describe("PATCH /api/user/application/evaluate", () => {
  test("Debe evaluar una solicitud existente", async () => {
    const user = await UserModel.create({
      username: "User9",
      email: "user9@example.com",
      password: "password9",
    });

    const application = await ApplicationModel.create({
      request: "Quiero ser critico de naughty dog",
      requestDate: new Date(),
      state: false,
      userId: user.id,
    });

    const response = await request(server)
      .patch("/api/user/application/evaluate")
      .set("x-token", token)
      .send({ email: "user9@example.com", state: true });

    expect(response.status).toBe(200);
    expect(response.body.state).toBe(true);
  });

  test("Debe retornar 404 si la solicitud no existe", async () => {
    const response = await request(server)
      .patch("/api/user/application/evaluate")
      .set("x-token", token)
      .send({ email: "nonexistent@example.com", state: true });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado");
  });

  test("Debe retornar 500 si hay un error en el servidor", async () => {
    jest.spyOn(ApplicationModel, "findOne").mockImplementation(() => {
      throw new Error("Error en el servidor");
    });

    const response = await request(server)
      .patch("/api/user/application/evaluate")
      .set("x-token", token)
      .send({ email: "user9@example.com", state: true });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("No se pudo evaluar la solicitud");

    ApplicationModel.findOne.mockRestore();
  });
});

describe("POST /api/user/rating", () => {
  test("Debe crear una calificación para un videojuego", async () => {
    const user = await UserModel.create({
      username: "User10",
      email: "user10@example.com",
      password: "password10",
    });

    const videogame = await VideogameModel.create({
      title: "Game1",
      description: "Description1",
      releaseDate: new Date("2021-01-01"),
      imageRoute: "game1.jpg",
    });

    const response = await request(server)
      .post("/api/user/rating")
      .set("x-token", token)
      .send({
        email: "user10@example.com",
        title: "Game1",
        releaseDate: new Date("2021-01-01"),
        rate: 85,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Calificación exitosa");
  });

  test("Debe retornar 404 si el videojuego no existe", async () => {
    const user = await UserModel.create({
      username: "User11",
      email: "user11@example.com",
      password: "password11",
    });

    const response = await request(server)
      .post("/api/user/rating")
      .set("x-token", token)
      .send({
        email: "user11@example.com",
        title: "NonExistentGame",
        releaseDate: new Date("2021-01-01"),
        rate: 85,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Videojuego no encontrado");
  });

  test("Debe retornar 500 si hay un error en el servidor", async () => {
    jest.spyOn(Rating.prototype, "save").mockImplementation(() => {
      throw new Error("Error en el servidor");
    });

    const response = await request(server)
      .post("/api/user/rating")
      .set("x-token", token)
      .send({
        email: "user10@example.com",
        title: "Game1",
        releaseDate: new Date("2021-01-01"),
        rate: 85,
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("No se pudo calificar");

    Rating.prototype.save.mockRestore();
  });
});

describe("POST /api/user/comment", () => {
  test("Debe crear un comentario para un videojuego", async () => {
    const user = await UserModel.create({
      username: "User12",
      email: "user12@example.com",
      password: "password12",
    });

    const videogame = await VideogameModel.create({
      title: "Game2",
      description: "Description2",
      releaseDate: new Date("2021-02-01"),
      imageRoute: "game2.jpg",
    });

    const rating = await RatingModel.create({
      rate: 85,
      createdAt: new Date(),
      userId: user.id,
      videogameId: videogame.id,
    });

    const response = await request(server)
      .post("/api/user/comment")
      .set("x-token", token)
      .send({
        email: "user12@example.com",
        title: "Game2",
        releaseDate: new Date("2021-02-01"),
        comment: "Este juego es increíble",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Comentario exitoso");
  });

  test("Debe retornar 404 si el videojuego no existe", async () => {
    const user = await UserModel.create({
      username: "User13",
      email: "user13@example.com",
      password: "password13",
    });

    const response = await request(server)
      .post("/api/user/comment")
      .set("x-token", token)
      .send({
        email: "user13@example.com",
        title: "NonExistentGame",
        releaseDate: new Date("2021-02-01"),
        comment: "Este juego es increíble",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Videojuego no encontrado");
  });

  test("Debe retornar 404 si no se ha calificado el videojuego", async () => {
    const user = await UserModel.create({
      username: "User14",
      email: "user14@example.com",
      password: "password14",
    });

    const videogame = await VideogameModel.create({
      title: "Game3",
      description: "Description3",
      releaseDate: new Date("2021-03-01"),
      imageRoute: "game3.jpg",
    });

    const response = await request(server)
      .post("/api/user/comment")
      .set("x-token", token)
      .send({
        email: "user14@example.com",
        title: "Game3",
        releaseDate: new Date("2021-03-01"),
        comment: "Este juego es increíble",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "No es posible comentar hasta calificar el juego"
    );
  });

  test("Debe retornar 500 si hay un error en el servidor", async () => {
    jest.spyOn(CommentModel, "findOne").mockImplementation(() => {
      throw new Error("Error en el servidor");
    });

    const response = await request(server)
      .post("/api/user/comment")
      .set("x-token", token)
      .send({
        email: "user12@example.com",
        title: "Game2",
        releaseDate: new Date("2021-02-01"),
        comment: "Este juego es increíble",
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("No se pudo comentar");

    CommentModel.findOne.mockRestore();
  });
});
