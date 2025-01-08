const request = require("supertest");
const database_test = require("../../models/context/IVDatabase_test");
const { server, server2 } = require("../../server_test");

const VideogameModel = require("../../models/Videogame");
const DeveloperModel = require("../../models/Developer");
const CommentModel = require("../../models/Comment");
const VideogameDetailedViewModel = require("../../models/views/VideogameDetailedView");
const e = require("express");

beforeAll(async () => {
  await database_test.sync({ force: false });

  const userToken = await request(server2).post("/api/user/login").send({
    email: "diego@gmail.com",
    password: "diego",
  });

  token = userToken.header["x-token"];
});

const clearDumbData = async () => {
  await request(server2)
    .patch("/api/videogame/comment/hide")
    .set("x-token", token)
    .send({
      value: false,
      title: "Fortnite",
      releaseDate: new Date("2017-07-25"),
      email: "diego@gmail.com",
    });

  await request(server2)
    .delete("/api/videogame/delete")
    .set("x-token", token)
    .send({
      title: "Grand Theft Auto VI",
      releaseDate: new Date("2025-09-17"),
    });

  await request(server2)
    .delete("/api/videogame/delete")
    .set("x-token", token)
    .send({
      title: "Grand Theft Auto VII: Liberty City",
      releaseDate: new Date("2034-10-17"),
    });

  await DeveloperModel.destroy({ where: { name: "Rockstar North" } });
};

afterAll(async () => {
  await clearDumbData();
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

describe("GET /api/videogame/rating", () => {
  test("Debe obtener la calificación de un videojuego de un usuario", async () => {
    const response = await request(server2)
      .get("/api/videogame/rating")
      .set("x-token", token)
      .send({
        title: "Fortnite",
        releaseDate: new Date("2017-07-25"),
        email: "diego@gmail.com",
      });

    expect(response.status).toBe(200);
    expect(response.body.rate).toBe(60);
  });

  test("Debe regresar un error 404 al buscar la calificación de un videojuego inexistente", async () => {
    const response = await request(server2)
      .get("/api/videogame/rating")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto VI",
        releaseDate: new Date("2025-09-17"),
        email: "diego@gmail.com",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Videojuego no encontrado");
  });

  test("Debe regresar un error 404 al buscar la calificación de un videojuego de un usuario inexistente", async () => {
    const response = await request(server2)
      .get("/api/videogame/rating")
      .set("x-token", token)
      .send({
        title: "Fortnite",
        releaseDate: new Date("2017-07-25"),
        email: "usuario@ejemplo.com",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado");
  });

  test("Debe regresar un error 404 al buscar la calificación de un videojuego de un usuario que no ha calificado", async () => {
    const response = await request(server2)
      .get("/api/videogame/rating")
      .set("x-token", token)
      .send({
        title: "Fortnite",
        releaseDate: new Date("2017-07-25"),
        email: "victoria@gmail.com",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Calificación no encontrada");
  });
});

describe("GET /api/videogame/comment", () => {
  test("Debe obtener el comentario de un videojuego de un usuario", async () => {
    const response = await request(server2)
      .get("/api/videogame/comment")
      .set("x-token", token)
      .send({
        title: "Fortnite",
        releaseDate: new Date("2017-07-25"),
        email: "diego@gmail.com",
      });

    expect(response.status).toBe(200);
  });

  test("Debe regresar un error 404 al buscar el comentario de un videojuego de un usuario que no ha comentado", async () => {
    const response = await request(server2)
      .get("/api/videogame/comment")
      .set("x-token", token)
      .send({
        title: "Fortnite",
        releaseDate: new Date("2017-07-25"),
        email: "victoria@gmail.com",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Comentario no encontrado");
  });

  test("Debe regresar un error 404 al buscar el comentario de un videojuego inexistente", async () => {
    const response = await request(server2)
      .get("/api/videogame/comment")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto VI",
        releaseDate: new Date("2025-09-17"),
        email: "diego@gmail.com",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Videojuego no encontrado");
  });

  test("Debe regresar un error 404 al buscar el comentario de un videojuego de un usuario inexistente", async () => {
    const response = await request(server2)
      .get("/api/videogame/comment")
      .set("x-token", token)
      .send({
        title: "Fortnite",
        releaseDate: new Date("2017-07-25"),
        email: "usuario@example.com",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado");
  });

  test("Debe regresar un error 500 al buscar el comentario", async () => {
    jest.spyOn(CommentModel, "findOne").mockImplementation(() => {
      throw new Error("Error al buscar el comentario");
    });

    const response = await request(server2)
      .get("/api/videogame/comment")
      .set("x-token", token)
      .send({
        title: "Fortnite",
        releaseDate: new Date("2017-07-25"),
        email: "diego@gmail.com",
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("No se pudo obtener el comentario");

    CommentModel.findOne.mockRestore();
  });
});

describe("GET /api/videogame/comments/critic", () => {
  test("Debe obtener los comentarios de un videojuego de los usuarios críticos", async () => {
    const response = await request(server2)
      .get("/api/videogame/comments/critic")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto V",
        releaseDate: new Date("2013-09-17"),
      });

    expect(response.status).toBe(200);
  });

  test("Debe regresar un error 404 al buscar los comentarios de un nombre de videojuego inexistente", async () => {
    const response = await request(server2)
      .get("/api/videogame/comments/critic")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto VI",
        releaseDate: new Date("2013-09-17"),
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Videojuego no encontrado");
  });

  test("Debe regresar un error 404 al buscar los comentarios de una fecha de lanzamiento de videojuego inexistente", async () => {
    const response = await request(server2)
      .get("/api/videogame/comments/critic")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto V",
        releaseDate: new Date("2025-09-17"),
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Videojuego no encontrado");
  });

  test("Debe regresar un error 500 al buscar los comentarios de un videojuego", async () => {
    jest.spyOn(CommentModel, "findAll").mockImplementation(() => {
      throw new Error("Error al buscar los comentarios");
    });

    const response = await request(server2)
      .get("/api/videogame/comments/critic")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto V",
        releaseDate: new Date("2013-09-17"),
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "No se pudieron obtener los comentarios"
    );

    CommentModel.findAll.mockRestore();
  });
});

describe("GET /api/videogame/comments/public", () => {
  test("Debe obtener los comentarios de un videojuego de los usuarios públicos", async () => {
    const response = await request(server2)
      .get("/api/videogame/comments/public")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto V",
        releaseDate: new Date("2013-09-17"),
      });

    expect(response.status).toBe(200);
  });

  test("Debe regresar un error 404 al buscar los comentarios de un nombre de videojuego inexistente", async () => {
    const response = await request(server2)
      .get("/api/videogame/comments/public")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto VI",
        releaseDate: new Date("2013-09-17"),
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Videojuego no encontrado");
  });

  test("Debe regresar un error 404 al buscar los comentarios de una fecha de lanzamiento de videojuego inexistente", async () => {
    const response = await request(server2)
      .get("/api/videogame/comments/public")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto V",
        releaseDate: new Date("2025-09-17"),
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Videojuego no encontrado");
  });

  test("Debe regresar un error 500 al buscar los comentarios de un videojuego", async () => {
    jest.spyOn(CommentModel, "findAll").mockImplementation(() => {
      throw new Error("Error al buscar los comentarios");
    });

    const response = await request(server2)
      .get("/api/videogame/comments/public")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto V",
        releaseDate: new Date("2013-09-17"),
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "No se pudieron obtener los comentarios"
    );

    CommentModel.findAll.mockRestore();
  });
});

describe("PATCH /api/videogame/comment/hide", () => {
  test("Debe ocultar un comentario de un videojuego", async () => {
    const response = await request(server2)
      .patch("/api/videogame/comment/hide")
      .set("x-token", token)
      .send({
        value: true,
        title: "Fortnite",
        releaseDate: new Date("2017-07-25"),
        email: "diego@gmail.com",
      });

    expect(response.status).toBe(200);

    const publicComments = await request(server2)
      .get("/api/videogame/comments/public")
      .set("x-token", token)
      .send({
        title: "Fortnite",
        releaseDate: new Date("2017-07-25"),
      });

    expect(publicComments.status).toBe(200);

    const comment = publicComments.body.find(
      (comment) => comment.rating.user.email === "diego@gmail.com"
    );

    expect(comment).toBeUndefined();
  });

  test("No debe ocultar un comentario de un videojuego inexistente", async () => {
    const response = await request(server2)
      .patch("/api/videogame/comment/hide")
      .set("x-token", token)
      .send({
        value: true,
        title: "Grand Theft Auto VI",
        releaseDate: new Date("2025-09-17"),
        email: "diego@gmail.com",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Videojuego no encontrado");
  });

  test("No debe ocultar un comentario de un usuario inexistente", async () => {
    const response = await request(server2)
      .patch("/api/videogame/comment/hide")
      .set("x-token", token)
      .send({
        value: true,
        title: "Fortnite",
        releaseDate: new Date("2017-07-25"),
        email: "usuario@example.com",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado");
  });

  test("No debe ocultar un comentario inexistente", async () => {
    const response = await request(server2)
      .patch("/api/videogame/comment/hide")
      .set("x-token", token)
      .send({
        value: true,
        title: "Fortnite",
        releaseDate: new Date("2017-07-25"),
        email: "victoria@gmail.com",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Comentario no encontrado");
  });

  test("Debe regresar un error 500 al ocultar un comentario", async () => {
    jest.spyOn(CommentModel, "findOne").mockImplementation(() => {
      throw new Error("Error al buscar el comentario");
    });

    const response = await request(server2)
      .patch("/api/videogame/comment/hide")
      .set("x-token", token)
      .send({
        value: true,
        title: "Fortnite",
        releaseDate: new Date("2017-07-25"),
        email: "diego@gmail.com",
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("No se pudo ocultar el comentario");

    CommentModel.findOne.mockRestore();
  });
});

describe("POST /api/videogame/add", () => {
  test("Debe agregar un videojuego", async () => {
    const response = await request(server2)
      .post("/api/videogame/add")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto VI",
        description:
          "Grand Theft Auto VI es un videojuego de acción y aventura desarrollado por Rockstar North.",
        releaseDate: new Date("2025-09-17"),
        imageRoute: "Grand_Theft_Auto_VI.png",
        developers: ["Rockstar North"],
        genres: ["Action", "Adventure"],
        platforms: ["PlayStation 5", "Xbox Series X"],
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Grand Theft Auto VI");

    const videogame = await VideogameModel.findOne({
      where: {
        title: "Grand Theft Auto VI",
        releaseDate: new Date("2025-09-17"),
      },
    });

    expect(videogame).not.toBeNull();
  });

  test("Debe regresar un error 400 al agregar un videojuego", async () => {
    jest.spyOn(VideogameModel, "create").mockImplementation(() => {
      throw new Error("Error al agregar el videojuego");
    });

    const response = await request(server2)
      .post("/api/videogame/add")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto VI",
        description:
          "Grand Theft Auto VI es un videojuego de acción y aventura desarrollado por Rockstar North.",
        releaseDate: new Date("2025-09-17"),
        imageRoute: "Grand_Theft_Auto_VI.png",
        developers: ["Rockstar North"],
        genres: ["Action", "Adventure"],
        platforms: ["PlayStation 5", "Xbox Series X"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No se pudo crear el videojuego");

    VideogameModel.create.mockRestore();
  });
});

describe("PUT /api/videogame/change", () => {
  test("Debe modificar un videojuego", async () => {
    const newVideogame = await request(server2)
      .post("/api/videogame/add")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto VII",
        description:
          "Grand Theft Auto VII es un videojuego de acción y aventura desarrollado por Rockstar North.",
        releaseDate: new Date("2034-09-17"),
        imageRoute: "Grand_Theft_Auto_VII.png",
        developers: ["Rockstar North"],
        genres: ["Action", "Adventure"],
        platforms: ["PlayStation 6", "PC"],
      });

    expect(newVideogame.status).toBe(201);

    const response = await request(server2)
      .put("/api/videogame/change")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto VII",
        releaseDate: new Date("2034-09-17"),
        newTitle: "Grand Theft Auto VII: Liberty City",
        newDescription:
          "Grand Theft Auto VII: Liberty City es un videojuego de acción y aventura desarrollado por Rockstar North.",
        newReleaseDate: new Date("2034-10-17"),
        newImageRoute: "Grand_Theft_Auto_VII_Liberty_City.png",
        newDeveloper: ["Rockstar North"],
        newGenres: ["Action", "Adventure"],
      });

    expect(response.status).toBe(200);
    expect(response.body.videogameUpdated.title).toBe(
      "Grand Theft Auto VII: Liberty City"
    );
    expect(response.body.message).toBe("Videojuego actualizado");

    const videogame = await VideogameModel.findOne({
      where: {
        title: "Grand Theft Auto VII: Liberty City",
        releaseDate: new Date("2034-10-17"),
      },
    });

    expect(videogame).not.toBeNull();
  });

  test("Debe regresar un error 404 al intentar modificar un videojuego inexistente", async () => {
    const response = await request(server2)
      .put("/api/videogame/change")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto IX",
        releaseDate: new Date("2055-09-17"),
        newTitle: "Grand Theft Auto IX: China Town",
        newDescription:
          "Grand Theft Auto IX: China Town es un videojuego de acción y aventura desarrollado por Rockstar North.",
        newReleaseDate: new Date("2025-10-17"),
        newImageRoute: "Grand_Theft_Auto_IX_China_Town.png",
        newDeveloper: ["Rockstar North"],
        newGenres: ["Action", "Adventure"],
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Videojuego no encontrado");
  });

  test("Debe regresar un error 500 al modificar un videojuego", async () => {
    jest.spyOn(VideogameModel, "findOne").mockImplementation(() => {
      throw new Error("Error al buscar el videojuego");
    });

    const response = await request(server2)
      .put("/api/videogame/change")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto VII",
        releaseDate: new Date("2034-09-17"),
        newTitle: "Grand Theft Auto VII: Liberty City",
        newDescription:
          "Grand Theft Auto VII: Liberty City es un videojuego de acción y aventura desarrollado por Rockstar North.",
        newReleaseDate: new Date("2034-10-17"),
        newImageRoute: "Grand_Theft_Auto_VII_Liberty_City.png",
        newDeveloper: ["Rockstar North"],
        newGenres: ["Action", "Adventure"],
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("No se pudo actualizar el videojuego");

    VideogameModel.findOne.mockRestore();
  });
});

describe("DELETE /api/videogame/delete", () => {
  test("Debe eliminar un videojuego", async () => {
    const newVideogame = await request(server2)
      .post("/api/videogame/add")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto VIII",
        description:
          "Grand Theft Auto VIII es un videojuego de acción y aventura desarrollado por Rockstar North.",
        releaseDate: new Date("2042-09-17"),
        imageRoute: "Grand_Theft_Auto_VIII.png",
        developers: ["Rockstar North"],
        genres: ["Action", "Adventure"],
        platforms: ["PlayStation 7", "PC"],
      });

    expect(newVideogame.status).toBe(201);

    const response = await request(server2)
      .delete("/api/videogame/delete")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto VIII",
        releaseDate: new Date("2042-09-17"),
      });

    expect(response.status).toBe(200);

    const videogame = await VideogameModel.findOne({
      where: {
        title: "Grand Theft Auto VIII",
        releaseDate: new Date("2042-09-17"),
      },
    });

    expect(videogame).toBeNull();
  });

  test("Debe regresar un error 404 al intentar eliminar un videojuego inexistente", async () => {
    const response = await request(server2)
      .delete("/api/videogame/delete")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto IX",
        releaseDate: new Date("2055-09-17"),
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Videojuego no encontrado");
  });

  test("Debe regresar un error 500 al eliminar un videojuego", async () => {
    jest.spyOn(VideogameModel, "findOne").mockImplementation(() => {
      throw new Error("Error al buscar el videojuego");
    });

    const response = await request(server2)
      .delete("/api/videogame/delete")
      .set("x-token", token)
      .send({
        title: "Grand Theft Auto VIII",
        releaseDate: new Date("2042-09-17"),
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("No se pudo eliminar el videojuego");

    VideogameModel.findOne.mockRestore();
  });
});
