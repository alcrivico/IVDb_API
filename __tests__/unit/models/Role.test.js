const { DataTypes, Transaction } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const RoleModel = require("../../models/Role");

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

describe("Crear Role", () => {
  test("Debe crear un rol válido", async () => {
    const role = await RoleModel.create(
      {
        name: "Moderator",
      },
      { transaction }
    );

    expect(role).toBeTruthy();
  });

  test("No debe crear un rol sin nombre", async () => {
    await expect(
      RoleModel.create(
        {
          // No se proporciona el nombre
        },
        { transaction }
      )
    ).rejects.toThrow();
  });
});

describe("Buscar Role", () => {
  test("Debe encontrar un rol por nombre", async () => {
    const role = await RoleModel.create(
      {
        name: "Analyst",
      },
      { transaction }
    );

    const foundRole = await RoleModel.findOne({
      where: { name: "Analyst" },
      transaction,
    });

    expect(foundRole).toBeTruthy();
  });

  test("No debe encontrar un rol por nombre incorrecto", async () => {
    const role = await RoleModel.findOne({
      where: { name: "NonExistentRole" },
      transaction,
    });

    expect(role).toBeNull();
  });
});

describe("Actualizar Role", () => {
  test("Debe crear y actualizar el nombre de un rol", async () => {
    const role = await RoleModel.create(
      {
        name: "TemporaryRole",
      },
      { transaction }
    );

    expect(role).toBeTruthy();

    role.name = "UpdatedRole";

    await role.save({ transaction });

    const roleUpdated = await RoleModel.findOne({
      where: {
        name: "UpdatedRole",
      },
      transaction,
    });

    expect(roleUpdated).toBeTruthy();
  });
});

describe("Eliminar Role", () => {
  test("Debe eliminar un rol existente", async () => {
    const role = await RoleModel.create(
      {
        name: "DeletableRole",
      },
      { transaction }
    );

    expect(role).toBeTruthy();

    await role.destroy({ transaction });

    const roleDeleted = await RoleModel.findOne({
      where: {
        name: "DeletableRole",
      },
      transaction,
    });

    expect(roleDeleted).toBeNull();
  });
});
