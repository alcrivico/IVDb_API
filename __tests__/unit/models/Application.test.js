const { DataTypes, Transaction } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const ApplicationModel = require("../../models/Application");
const UserModel = require("../../models/User");

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

describe("Crear Application", () => {
  test("Debe crear una aplicación válida", async () => {
    const user = await UserModel.create(
      {
        username: "User1",
        email: "user1@example.com",
        password: "password1",
      },
      { transaction }
    );

    const application = await ApplicationModel.create(
      {
        request: "Quiero ser un buen critico",
        requestDate: new Date(),
        state: false,
        userId: user.id,
      },
      { transaction }
    );

    expect(application).toBeTruthy();
  });

  test("No debe crear una aplicación sin request", async () => {
    const user = await UserModel.create(
      {
        username: "User2",
        email: "user2@example.com",
        password: "password2",
      },
      { transaction }
    );

    const application = await ApplicationModel.create(
      {
        requestDate: new Date(),
        state: false,
        userId: user.id,
      },
      { transaction }
    );

    expect(application).toBeTruthy();
  });

  test("No debe crear una aplicación sin userId", async () => {
    await expect(
      ApplicationModel.create(
        {
          request: "Quiero ser un critico excelente",
          requestDate: new Date(),
          state: false,
        },
        { transaction }
      )
    ).rejects.toThrow();
  });
});

describe("Buscar Application", () => {
  test("Debe encontrar una aplicación por request", async () => {
    const user = await UserModel.create(
      {
        username: "User3",
        email: "user3@example.com",
        password: "password3",
      },
      { transaction }
    );

    const application = await ApplicationModel.create(
      {
        request: "Quiero ser critico especializado por favor",
        requestDate: new Date(),
        state: false,
        userId: user.id,
      },
      { transaction }
    );

    const foundApplication = await ApplicationModel.findOne({
      where: { request: "Quiero ser critico especializado por favor" },
      transaction,
    });

    expect(foundApplication).toBeTruthy();
  });

  test("No debe encontrar una aplicación por request incorrecto", async () => {
    const application = await ApplicationModel.findOne({
      where: { request: "Solicitud no existente" },
      transaction,
    });

    expect(application).toBeNull();
  });
});

describe("Actualizar Application", () => {
  test("Debe crear y actualizar el estado de una aplicación", async () => {
    const user = await UserModel.create(
      {
        username: "User4",
        email: "user4@example.com",
        password: "password4",
      },
      { transaction }
    );

    const application = await ApplicationModel.create(
      {
        request: "Quiero ser critico enfocado en videojuego de estrategia",
        requestDate: new Date(),
        state: false,
        userId: user.id,
      },
      { transaction }
    );

    expect(application).toBeTruthy();

    application.state = true;

    await application.save({ transaction });

    const applicationUpdated = await ApplicationModel.findOne({
      where: {
        request: "Quiero ser critico enfocado en videojuego de estrategia",
        state: true,
      },
      transaction,
    });

    expect(applicationUpdated).toBeTruthy();
  });
});

describe("Eliminar Application", () => {
  test("Debe eliminar una aplicación existente", async () => {
    const user = await UserModel.create(
      {
        username: "User5",
        email: "user5@example.com",
        password: "password5",
      },
      { transaction }
    );

    const application = await ApplicationModel.create(
      {
        request: "Quiero ser critico de juegos de rpg",
        requestDate: new Date(),
        state: false,
        userId: user.id,
      },
      { transaction }
    );

    expect(application).toBeTruthy();

    await application.destroy({ transaction });

    const applicationDeleted = await ApplicationModel.findOne({
      where: {
        request: "Quiero ser critico de juegos de rpg",
      },
      transaction,
    });

    expect(applicationDeleted).toBeNull();
  });
});
