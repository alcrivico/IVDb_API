const { DataTypes } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const RoleModel = require("../../models/Role");

beforeAll(async () => {
  await database_test.sync({ force: false });
});

afterAll(async () => {
  await RoleModel.destroy({ where: {} });
  await database_test.close();
});

describe("Crear Role", () => {
  test("Debe crear un rol válido", async () => {
    const role = await RoleModel.create({
      name: "Moderator",
    });

    expect(role).toBeTruthy();
  });

  test("No debe crear un rol sin nombre", async () => {
    await expect(
      RoleModel.create({
        // No se proporciona el nombre
      })
    ).rejects.toThrow();
  });
});

describe("Buscar Role", () => {
  test("Debe encontrar un rol por nombre", async () => {
    const role = await RoleModel.create({
      name: "Analyst",
    });

    const foundRole = await RoleModel.findOne({
      where: { name: "Analyst" },
    });

    expect(foundRole).toBeTruthy();
  });

  test("No debe encontrar un rol por nombre incorrecto", async () => {
    const role = await RoleModel.findOne({
      where: { name: "NonExistentRole" },
    });

    expect(role).toBeNull();
  });
});

describe("Actualizar Role", () => {
  test("Debe crear y actualizar el nombre de un rol", async () => {
    const role = await RoleModel.create({
      name: "TemporaryRole",
    });

    expect(role).toBeTruthy();

    role.name = "UpdatedRole";

    await role.save();

    const roleUpdated = await RoleModel.findOne({
      where: {
        name: "UpdatedRole",
      },
    });

    expect(roleUpdated).toBeTruthy();
  });
});

describe("Eliminar Role", () => {
  test("Debe eliminar un rol existente", async () => {
    const role = await RoleModel.create({
      name: "DeletableRole",
    });

    expect(role).toBeTruthy();

    await role.destroy();

    const roleDeleted = await RoleModel.findOne({
      where: {
        name: "DeletableRole",
      },
    });

    expect(roleDeleted).toBeNull();
  });
});
