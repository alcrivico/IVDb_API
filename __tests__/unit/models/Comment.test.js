const { DataTypes, Transaction } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const CommentModel = require("../../models/Comment");
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

describe("Crear Comment", () => {
  test("Debe crear un comentario válido", async () => {
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

    const comment = await CommentModel.create(
      {
        content: "Este juego es increíble",
        createdAt: new Date(),
        hidden: false,
        ratingId: rating.id,
      },
      { transaction }
    );

    expect(comment).toBeTruthy();
  });

  test("No debe crear un comentario sin contenido", async () => {
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

    const rating = await RatingModel.create(
      {
        rate: 75,
        createdAt: new Date(),
        userId: user.id,
        videogameId: videogame.id,
      },
      { transaction }
    );

    await expect(
      CommentModel.create(
        {
          createdAt: new Date(),
          hidden: false,
          ratingId: rating.id,
        },
        { transaction }
      )
    ).rejects.toThrow();
  });

  test("No debe crear un comentario sin ratingId", async () => {
    await expect(
      CommentModel.create(
        {
          content: "Este juego es bueno",
          createdAt: new Date(),
          hidden: false,
        },
        { transaction }
      )
    ).rejects.toThrow();
  });
});

describe("Buscar Comment", () => {
  test("Debe encontrar un comentario por contenido", async () => {
    const user = await UserModel.create(
      {
        username: "User3",
        email: "user3@example.com",
        password: "password3",
      },
      { transaction }
    );

    const videogame = await VideogameModel.create(
      {
        title: "Game3",
        description: "Description3",
        releaseDate: new Date("2021-03-01"),
        imageRoute: "game3.jpg",
      },
      { transaction }
    );

    const rating = await RatingModel.create(
      {
        rate: 65,
        createdAt: new Date(),
        userId: user.id,
        videogameId: videogame.id,
      },
      { transaction }
    );

    const comment = await CommentModel.create(
      {
        content: "Este juego es decente",
        createdAt: new Date(),
        hidden: false,
        ratingId: rating.id,
      },
      { transaction }
    );

    const foundComment = await CommentModel.findOne({
      where: { content: "Este juego es decente" },
      transaction,
    });

    expect(foundComment).toBeTruthy();
  });

  test("No debe encontrar un comentario por contenido incorrecto", async () => {
    const comment = await CommentModel.findOne({
      where: { content: "Comentario no existente" },
      transaction,
    });

    expect(comment).toBeNull();
  });
});

describe("Actualizar Comment", () => {
  test("Debe crear y actualizar el contenido de un comentario", async () => {
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

    const rating = await RatingModel.create(
      {
        rate: 55,
        createdAt: new Date(),
        userId: user.id,
        videogameId: videogame.id,
      },
      { transaction }
    );

    const comment = await CommentModel.create(
      {
        content: "Este juego es aceptable",
        createdAt: new Date(),
        hidden: false,
        ratingId: rating.id,
      },
      { transaction }
    );

    expect(comment).toBeTruthy();

    comment.content = "Este juego es bastante bueno";

    await comment.save({ transaction });

    const commentUpdated = await CommentModel.findOne({
      where: {
        content: "Este juego es bastante bueno",
      },
      transaction,
    });

    expect(commentUpdated).toBeTruthy();
  });
});

describe("Eliminar Comment", () => {
  test("Debe eliminar un comentario existente", async () => {
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
        rate: 45,
        createdAt: new Date(),
        userId: user.id,
        videogameId: videogame.id,
      },
      { transaction }
    );

    const comment = await CommentModel.create(
      {
        content: "Este juego es regular",
        createdAt: new Date(),
        hidden: false,
        ratingId: rating.id,
      },
      { transaction }
    );

    expect(comment).toBeTruthy();

    await comment.destroy({ transaction });

    const commentDeleted = await CommentModel.findOne({
      where: {
        content: "Este juego es regular",
      },
      transaction,
    });

    expect(commentDeleted).toBeNull();
  });
});
