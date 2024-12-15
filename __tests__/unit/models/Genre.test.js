const { DataTypes, Transaction } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const GenreModel = require("../../models/Genre");

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

describe("Crear Genre", () => {
  test("Debe crear un género válido", async () => {
    const genre = await GenreModel.create(
      {
        name: "Platformer",
      },
      { transaction }
    );

    expect(genre).toBeTruthy();
  });

  test("No debe crear un género sin nombre", async () => {
    await expect(
      GenreModel.create(
        {
          // No se proporciona el nombre
        },
        { transaction }
      )
    ).rejects.toThrow();
  });

  test("No debe crear un género con nombre duplicado", async () => {
    await GenreModel.create(
      {
        name: "Shooter",
      },
      { transaction }
    );

    await expect(
      GenreModel.create(
        {
          name: "Shooter",
        },
        { transaction }
      )
    ).rejects.toThrow();
  });
});

describe("Buscar Genre", () => {
  test("Debe encontrar un género por nombre", async () => {
    const genre = await GenreModel.create(
      {
        name: "Fighting",
      },
      { transaction }
    );

    const foundGenre = await GenreModel.findOne({
      where: { name: "Fighting" },
      transaction,
    });

    expect(foundGenre).toBeTruthy();
  });

  test("No debe encontrar un género por nombre incorrecto", async () => {
    const genre = await GenreModel.findOne({
      where: { name: "NonExistentGenre" },
      transaction,
    });

    expect(genre).toBeNull();
  });
});

describe("Actualizar Genre", () => {
  test("Debe crear y actualizar el nombre de un género", async () => {
    const genre = await GenreModel.create(
      {
        name: "TemporaryGenre",
      },
      { transaction }
    );

    expect(genre).toBeTruthy();

    genre.name = "UpdatedGenre";

    await genre.save({ transaction });

    const genreUpdated = await GenreModel.findOne({
      where: {
        name: "UpdatedGenre",
      },
      transaction,
    });

    expect(genreUpdated).toBeTruthy();
  });
});

describe("Eliminar Genre", () => {
  test("Debe eliminar un género existente", async () => {
    const genre = await GenreModel.create(
      {
        name: "DeletableGenre",
      },
      { transaction }
    );

    expect(genre).toBeTruthy();

    await genre.destroy({ transaction });

    const genreDeleted = await GenreModel.findOne({
      where: {
        name: "DeletableGenre",
      },
      transaction,
    });

    expect(genreDeleted).toBeNull();
  });
});
