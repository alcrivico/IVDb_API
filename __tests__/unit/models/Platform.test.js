const { DataTypes, Transaction } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const PlatformModel = require("../../models/Platform");

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

describe("Crear Platform", () => {
  test("Debe crear una plataforma válida", async () => {
    const platform = await PlatformModel.create(
      {
        name: "Steam Deck",
      },
      { transaction }
    );

    expect(platform).toBeTruthy();
  });

  test("No debe crear una plataforma sin nombre", async () => {
    await expect(
      PlatformModel.create(
        {
          // No se proporciona el nombre
        },
        { transaction }
      )
    ).rejects.toThrow();
  });

  test("No debe crear una plataforma con nombre duplicado", async () => {
    await PlatformModel.create(
      {
        name: "Amazon Luna",
      },
      { transaction }
    );

    await expect(
      PlatformModel.create(
        {
          name: "Amazon Luna",
        },
        { transaction }
      )
    ).rejects.toThrow();
  });
});

describe("Buscar Platform", () => {
  test("Debe encontrar una plataforma por nombre", async () => {
    const platform = await PlatformModel.create(
      {
        name: "Nvidia Shield",
      },
      { transaction }
    );

    const foundPlatform = await PlatformModel.findOne({
      where: { name: "Nvidia Shield" },
      transaction,
    });

    expect(foundPlatform).toBeTruthy();
  });

  test("No debe encontrar una plataforma por nombre incorrecto", async () => {
    const platform = await PlatformModel.findOne({
      where: { name: "NonExistentPlatform" },
      transaction,
    });

    expect(platform).toBeNull();
  });
});

describe("Actualizar Platform", () => {
  test("Debe crear y actualizar el nombre de una plataforma", async () => {
    const platform = await PlatformModel.create(
      {
        name: "TemporaryPlatform",
      },
      { transaction }
    );

    expect(platform).toBeTruthy();

    platform.name = "UpdatedPlatform";

    await platform.save({ transaction });

    const platformUpdated = await PlatformModel.findOne({
      where: {
        name: "UpdatedPlatform",
      },
      transaction,
    });

    expect(platformUpdated).toBeTruthy();
  });
});

describe("Eliminar Platform", () => {
  test("Debe eliminar una plataforma existente", async () => {
    const platform = await PlatformModel.create(
      {
        name: "DeletablePlatform",
      },
      { transaction }
    );

    expect(platform).toBeTruthy();

    await platform.destroy({ transaction });

    const platformDeleted = await PlatformModel.findOne({
      where: {
        name: "DeletablePlatform",
      },
      transaction,
    });

    expect(platformDeleted).toBeNull();
  });
});
