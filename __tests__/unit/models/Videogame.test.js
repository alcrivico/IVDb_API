const { DataTypes, Transaction } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

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

describe("Crear Videogame", () => {
  test("Debe crear un videojuego válido", async () => {
    const videogame = await VideogameModel.create(
      {
        title: "Super Mario Odyssey",
        description: "Un juego de plataformas en 3D protagonizado por Mario.",
        releaseDate: new Date("2017-10-27"),
        imageRoute: "mario.jpg",
      },
      { transaction }
    );

    expect(videogame).toBeTruthy();
  });

  test("No debe crear un videojuego sin título", async () => {
    await expect(
      VideogameModel.create(
        {
          description:
            "Un juego de rol de acción en un mundo abierto ambientado en un futuro distópico.",
          releaseDate: new Date("2020-12-10"),
          imageRoute: "cyberpunk2077.jpg",
        },
        { transaction }
      )
    ).rejects.toThrow();
  });

  test("No debe crear un videojuego sin descripción", async () => {
    await expect(
      VideogameModel.create(
        {
          title: "Horizon Zero Dawn",
          releaseDate: new Date("2017-02-28"),
          imageRoute: "horizon.jpg",
        },
        { transaction }
      )
    ).rejects.toThrow();
  });

  test("No debe crear un videojuego sin fecha de lanzamiento", async () => {
    await expect(
      VideogameModel.create(
        {
          title: "God of War",
          description:
            "Un juego de acción y aventura basado en la mitología nórdica.",
          imageRoute: "gow.jpg",
        },
        { transaction }
      )
    ).rejects.toThrow();
  });

  test("No debe crear un videojuego sin ruta de imagen", async () => {
    await expect(
      VideogameModel.create(
        {
          title: "Ghost of Tsushima",
          description:
            "Un juego de acción y aventura ambientado en el Japón feudal.",
          releaseDate: new Date("2020-07-17"),
        },
        { transaction }
      )
    ).rejects.toThrow();
  });
});

describe("Buscar Videogame", () => {
  test("Debe encontrar un videojuego por título", async () => {
    const videogame = await VideogameModel.create(
      {
        title: "Super Mario Odyssey",
        description: "Un juego de plataformas en 3D protagonizado por Mario.",
        releaseDate: new Date("2017-10-27"),
        imageRoute: "mario.jpg",
      },
      { transaction }
    );

    const foundVideogame = await VideogameModel.findOne({
      where: { title: "Super Mario Odyssey" },
      transaction,
    });

    expect(foundVideogame).toBeTruthy();
  });

  test("No debe encontrar un videojuego por título incorrecto", async () => {
    const videogame = await VideogameModel.findOne({
      where: { title: "Juego Incorrecto" },
      transaction,
    });

    expect(videogame).toBeNull();
  });
});

describe("Actualizar Videogame", () => {
  test("Debe crear y actualizar el título de un videojuego", async () => {
    const videogame = await VideogameModel.create(
      {
        title: "Horizon",
        description: "Un juego de rol de acción en un mundo post-apocalíptico.",
        releaseDate: new Date("2017-02-28"),
        imageRoute: "horizon.jpg",
      },
      { transaction }
    );

    expect(videogame).toBeTruthy();

    videogame.title = "Horizon Zero Dawn";

    await videogame.save({ transaction });

    const videogameUpdated = await VideogameModel.findOne({
      where: {
        title: "Horizon Zero Dawn",
      },
      transaction,
    });

    expect(videogameUpdated).toBeTruthy();
  });

  test("Debe crear y actualizar la descripción de un videojuego", async () => {
    const videogame = await VideogameModel.create(
      {
        title: "God of War",
        description: "Un juego de acción.",
        releaseDate: new Date("2018-04-20"),
        imageRoute: "gow.jpg",
      },
      { transaction }
    );

    expect(videogame).toBeTruthy();

    videogame.description =
      "Un juego de acción y aventura basado en la mitología nórdica.";

    await videogame.save({ transaction });

    const videogameUpdated = await VideogameModel.findOne({
      where: {
        title: "God of War",
        description:
          "Un juego de acción y aventura basado en la mitología nórdica.",
      },
      transaction,
    });

    expect(videogameUpdated).toBeTruthy();
  });

  test("Debe crear y actualizar la fecha de lanzamiento de un videojuego", async () => {
    const videogame = await VideogameModel.create(
      {
        title: "Ghost of Tsushima",
        description:
          "Un juego de acción y aventura ambientado en el Japón feudal.",
        releaseDate: new Date("2020-01-01"),
        imageRoute: "ghost.jpg",
      },
      { transaction }
    );

    expect(videogame).toBeTruthy();

    videogame.releaseDate = new Date("2020-07-17");

    await videogame.save({ transaction });

    const videogameUpdated = await VideogameModel.findOne({
      where: {
        title: "Ghost of Tsushima",
        releaseDate: new Date("2020-07-17"),
      },
      transaction,
    });

    expect(videogameUpdated).toBeTruthy();
  });

  test("Debe crear y actualizar la ruta de imagen de un videojuego", async () => {
    const videogame = await VideogameModel.create(
      {
        title: "Cyberpunk 2077",
        description:
          "Un juego de rol de acción en un mundo abierto ambientado en un futuro distópico.",
        releaseDate: new Date("2020-12-10"),
        imageRoute: "cyberpunk.png",
      },
      { transaction }
    );

    expect(videogame).toBeTruthy();

    videogame.imageRoute = "cyberpunk2077.jpg";

    await videogame.save({ transaction });

    const videogameUpdated = await VideogameModel.findOne({
      where: {
        title: "Cyberpunk 2077",
        imageRoute: "cyberpunk2077.jpg",
      },
      transaction,
    });

    expect(videogameUpdated).toBeTruthy();
  });
});

describe("Eliminar Videogame", () => {
  test("Debe eliminar un videojuego existente", async () => {
    const videogame = await VideogameModel.create(
      {
        title: "Assassin's Creed Valhalla",
        description:
          "Un juego de rol de acción en un mundo abierto ambientado en la era vikinga.",
        releaseDate: new Date("2020-11-10"),
        imageRoute: "acvalhalla.jpg",
      },
      { transaction }
    );

    expect(videogame).toBeTruthy();

    await videogame.destroy({ transaction });

    const videogameDeleted = await VideogameModel.findOne({
      where: {
        title: "Assassin's Creed Valhalla",
      },
      transaction,
    });

    expect(videogameDeleted).toBeNull();
  });
});
