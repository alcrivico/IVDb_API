const { DataTypes, Transaction } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const DeveloperModel = require("../../models/Developer");

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

describe("Crear Developer", () => {
  test("Debe crear un desarrollador válido", async () => {
    const developer = await DeveloperModel.create(
      {
        name: "Insomniac Games",
      },
      { transaction }
    );

    expect(developer).toBeTruthy();
  });

  test("No debe crear un desarrollador sin nombre", async () => {
    await expect(
      DeveloperModel.create(
        {
          // No se proporciona el nombre
        },
        { transaction }
      )
    ).rejects.toThrow();
  });

  test("No debe crear un desarrollador con nombre duplicado", async () => {
    await DeveloperModel.create(
      {
        name: "Bungie",
      },
      { transaction }
    );

    await expect(
      DeveloperModel.create(
        {
          name: "Bungie",
        },
        { transaction }
      )
    ).rejects.toThrow();
  });
});

describe("Buscar Developer", () => {
  test("Debe encontrar un desarrollador por nombre", async () => {
    const developer = await DeveloperModel.create(
      {
        name: "FromSoftware",
      },
      { transaction }
    );

    const foundDeveloper = await DeveloperModel.findOne({
      where: { name: "FromSoftware" },
      transaction,
    });

    expect(foundDeveloper).toBeTruthy();
  });

  test("No debe encontrar un desarrollador por nombre incorrecto", async () => {
    const developer = await DeveloperModel.findOne({
      where: { name: "NonExistentDeveloper" },
      transaction,
    });

    expect(developer).toBeNull();
  });
});

describe("Actualizar Developer", () => {
  test("Debe crear y actualizar el nombre de un desarrollador", async () => {
    const developer = await DeveloperModel.create(
      {
        name: "TemporaryDeveloper",
      },
      { transaction }
    );

    expect(developer).toBeTruthy();

    developer.name = "UpdatedDeveloper";

    await developer.save({ transaction });

    const developerUpdated = await DeveloperModel.findOne({
      where: {
        name: "UpdatedDeveloper",
      },
      transaction,
    });

    expect(developerUpdated).toBeTruthy();
  });
});

describe("Eliminar Developer", () => {
  test("Debe eliminar un desarrollador existente", async () => {
    const developer = await DeveloperModel.create(
      {
        name: "DeletableDeveloper",
      },
      { transaction }
    );

    expect(developer).toBeTruthy();

    await developer.destroy({ transaction });

    const developerDeleted = await DeveloperModel.findOne({
      where: {
        name: "DeletableDeveloper",
      },
      transaction,
    });

    expect(developerDeleted).toBeNull();
  });
});
