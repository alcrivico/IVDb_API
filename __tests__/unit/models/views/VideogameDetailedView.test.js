const { DataTypes, Transaction, Op } = require("sequelize");

const database_test = require("../../../models/context/IVDatabase_test");

const VideogameDetailedViewModel = require("../../../models/views/VideogameDetailedView");

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

describe("Consultar VideogameDetailedView", () => {
  test("Debe encontrar un videojuego por título", async () => {
    const videogame = await VideogameDetailedViewModel.findOne({
      where: { title: "The Legend of Zelda: Breath of the Wild" },
      transaction,
    });

    expect(videogame).toBeTruthy();
    expect(videogame.title).toBe("The Legend of Zelda: Breath of the Wild");
  });

  test("Debe encontrar un videojuego por desarrollador", async () => {
    const videogame = await VideogameDetailedViewModel.findOne({
      where: { developers: "Nintendo" },
      transaction,
    });

    expect(videogame).toBeTruthy();
    expect(videogame.developers).toBe("Nintendo");
  });

  test("Debe encontrar un videojuego por plataforma", async () => {
    const videogame = await VideogameDetailedViewModel.findOne({
      where: { platforms: "PC, PS3, Xbox 360" },
      transaction,
    });

    expect(videogame).toBeTruthy();
    expect(videogame.platforms).toBe("PC, PS3, Xbox 360");
  });

  test("Debe encontrar un videojuego por género", async () => {
    const videogame = await VideogameDetailedViewModel.findOne({
      where: { genres: "Action, Adventure, RPG" },
      transaction,
    });

    expect(videogame).toBeTruthy();
    expect(videogame.genres).toBe("Action, Adventure, RPG");
  });

  test("Debe encontrar un videojuego por calificación promedio de críticos", async () => {
    const videogame = await VideogameDetailedViewModel.findOne({
      where: { criticAvgRating: { [Op.gte]: 80.0 } },
      transaction,
    });

    expect(videogame).toBeTruthy();
    expect(parseFloat(videogame.criticAvgRating)).toBeGreaterThanOrEqual(80.0);
  });

  test("Debe encontrar un videojuego por calificación promedio del público", async () => {
    const videogame = await VideogameDetailedViewModel.findOne({
      where: { publicAvgRating: { [Op.gte]: 40.0 } },
      transaction,
    });

    expect(videogame).toBeTruthy();
    expect(parseFloat(videogame.publicAvgRating)).toBeGreaterThanOrEqual(40.0);
  });

  test("No debe encontrar un videojuego por título incorrecto", async () => {
    const videogame = await VideogameDetailedViewModel.findOne({
      where: { title: "NonExistentGame" },
      transaction,
    });

    expect(videogame).toBeNull();
  });
});
