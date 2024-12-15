const { DataTypes, Transaction } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const RatingModel = require("../../models/Rating");
const UserModel = require("../../models/User");
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

describe("Crear Rating", () => {
  test("Debe crear un rating válido", async () => {
    const user = await UserModel.create(
      {
        username: "User1",
        email: "user1@example.com",
        password: "password1",
      },
      { transaction }
    );

    const videogame = await VideogameModel.create(
      {
        title: "Game1",
        description: "Description1",
        releaseDate: new Date("2021-01-01"),
        imageRoute: "game1.jpg",
      },
      { transaction }
    );

    const rating = await RatingModel.create(
      {
        rate: 85,
        createdAt: new Date(),
        userId: user.id,
        videogameId: videogame.id,
      },
      { transaction }
    );

    expect(rating).toBeTruthy();
  });

  test("No debe crear un rating sin rate", async () => {
    const user = await UserModel.create(
      {
        username: "User2",
        email: "user2@example.com",
        password: "password2",
      },
      { transaction }
    );

    const videogame = await VideogameModel.create(
      {
        title: "Game2",
        description: "Description2",
        releaseDate: new Date("2021-02-01"),
        imageRoute: "game2.jpg",
      },
      { transaction }
    );

    await expect(
      RatingModel.create(
        {
          createdAt: new Date(),
          userId: user.id,
          videogameId: videogame.id,
        },
        { transaction }
      )
    ).rejects.toThrow();
  });

  test("No debe crear un rating sin userId", async () => {
    const videogame = await VideogameModel.create(
      {
        title: "Game3",
        description: "Description3",
        releaseDate: new Date("2021-03-01"),
        imageRoute: "game3.jpg",
      },
      { transaction }
    );

    await expect(
      RatingModel.create(
        {
          rate: 75,
          createdAt: new Date(),
          videogameId: videogame.id,
        },
        { transaction }
      )
    ).rejects.toThrow();
  });

  test("No debe crear un rating sin videogameId", async () => {
    const user = await UserModel.create(
      {
        username: "User3",
        email: "user3@example.com",
        password: "password3",
      },
      { transaction }
    );

    await expect(
      RatingModel.create(
        {
          rate: 65,
          createdAt: new Date(),
          userId: user.id,
        },
        { transaction }
      )
    ).rejects.toThrow();
  });

  test("Debe crear un rating con fecha de creación específica", async () => {
    const user = await UserModel.create(
      {
        username: "User4",
        email: "user4@example.com",
        password: "password4",
      },
      { transaction }
    );

    const videogame = await VideogameModel.create(
      {
        title: "Game4",
        description: "Description4",
        releaseDate: new Date("2021-04-01"),
        imageRoute: "game4.jpg",
      },
      { transaction }
    );

    const specificDate = new Date("2020-01-01");

    const rating = await RatingModel.create(
      {
        rate: 95,
        createdAt: specificDate,
        userId: user.id,
        videogameId: videogame.id,
      },
      { transaction }
    );

    expect(rating.createdAt).toEqual(specificDate);
  });
});

describe("Buscar Rating", () => {
  test("Debe encontrar un rating por rate", async () => {
    const user = await UserModel.create(
      {
        username: "User5",
        email: "user5@example.com",
        password: "password5",
      },
      { transaction }
    );

    const videogame = await VideogameModel.create(
      {
        title: "Game5",
        description: "Description5",
        releaseDate: new Date("2021-05-01"),
        imageRoute: "game5.jpg",
      },
      { transaction }
    );

    const rating = await RatingModel.create(
      {
        rate: 55,
        createdAt: new Date(),
        userId: user.id,
        videogameId: videogame.id,
      },
      { transaction }
    );

    expect(rating).toBeTruthy();

    const foundRating = await RatingModel.findOne({
      where: { rate: 55 },
      transaction,
    });

    expect(foundRating).toBeTruthy();
  });

  test("No debe encontrar un rating por rate incorrecto", async () => {
    const rating = await RatingModel.findOne({
      where: { rate: 999 },
      transaction,
    });

    expect(rating).toBeNull();
  });
});

describe("Actualizar Rating", () => {
  test("Debe crear y actualizar el rate de un rating", async () => {
    const user = await UserModel.create(
      {
        username: "User6",
        email: "user6@example.com",
        password: "password6",
      },
      { transaction }
    );

    const videogame = await VideogameModel.create(
      {
        title: "Game6",
        description: "Description6",
        releaseDate: new Date("2021-06-01"),
        imageRoute: "game6.jpg",
      },
      { transaction }
    );

    const rating = await RatingModel.create(
      {
        rate: 45,
        createdAt: new Date(),
        userId: user.id,
        videogameId: videogame.id,
      },
      { transaction }
    );

    expect(rating).toBeTruthy();

    rating.rate = 90;

    await rating.save({ transaction });

    const ratingUpdated = await RatingModel.findOne({
      where: {
        rate: 90,
      },
      transaction,
    });

    expect(ratingUpdated).toBeTruthy();
  });
});

describe("Eliminar Rating", () => {
  test("Debe eliminar un rating existente", async () => {
    const user = await UserModel.create(
      {
        username: "User7",
        email: "user7@example.com",
        password: "password7",
      },
      { transaction }
    );

    const videogame = await VideogameModel.create(
      {
        title: "Game7",
        description: "Description7",
        releaseDate: new Date("2021-07-01"),
        imageRoute: "game7.jpg",
      },
      { transaction }
    );

    const rating = await RatingModel.create(
      {
        rate: 35,
        createdAt: new Date(),
        userId: user.id,
        videogameId: videogame.id,
      },
      { transaction }
    );

    expect(rating).toBeTruthy();

    await rating.destroy({ transaction });

    const ratingDeleted = await RatingModel.findOne({
      where: {
        rate: 35,
      },
      transaction,
    });

    expect(ratingDeleted).toBeNull();
  });
});
