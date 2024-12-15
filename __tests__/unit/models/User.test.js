const { DataTypes } = require("sequelize");

const database_test = require("../../models/context/IVDatabase_test");

const UserModel = require("../../models/User");
const e = require("express");

beforeAll(async () => {
  await database_test.sync({ force: true });
});

afterAll(async () => {
  await UserModel.destroy({ where: {} });

  await database_test.close();
});

describe("Crear User", () => {
  test("Debe crear un usuario válido", async () => {
    const user = await UserModel.create({
      username: "Rodrigo",
      email: "rodrigo@gmail.com",
      password: "rodrigo",
    });

    expect(user).toBeTruthy();
  });

  test("No debe crear un usuario sin username", async () => {
    await expect(
      UserModel.create({
        email: "daniel@gmail.com",
        password: "daniel",
      })
    ).rejects.toThrow();
  });

  test("No debe crear un usuario sin email", async () => {
    await expect(
      UserModel.create({
        username: "Daniel",
        password: "daniel",
      })
    ).rejects.toThrow();
  });

  test("No debe crear un usuario sin password", async () => {
    await expect(
      UserModel.create({
        username: "Daniel",
        email: "daniel@gmail.com",
      })
    ).rejects.toThrow();
  });
});

describe("Buscar User", () => {
  test("Debe encontrar un usuario por email y password", async () => {
    const user = await UserModel.findOne({
      where: { email: "rodrigo@gmail.com", password: "rodrigo" },
    });

    expect(user).toBeTruthy();
  });

  test("No debe encontrar un usuario por password incorrecto", async () => {
    const user = await UserModel.findOne({
      where: { email: "rodrigo@gmail.com", password: "daniel" },
    });

    expect(user).toBeNull();
  });

  test("No debe encontrar un usuario por email incorrecto", async () => {
    const user = await UserModel.findOne({
      where: { email: "rodrigp@gmail.com", password: "rodrigo" },
    });

    expect(user).toBeNull();
  });

  test("No debe encontrar un usuario por email y password incorrectos", async () => {
    const user = await UserModel.findOne({
      where: { email: "rodrigp@gmail.com", password: "rodrigp" },
    });

    expect(user).toBeNull();
  });
});

describe("Actualizar User", () => {
  test("Debe crear y actualizar el nombre de un usuario", async () => {
    const user = await UserModel.create({
      username: "Lucas",
      email: "lucas@gmail.com",
      password: "lucas",
    });

    expect(user).toBeTruthy();

    user.username = "Lucas Gabriel";

    await user.save();

    const userUpdated = await UserModel.findOne({
      where: {
        username: "Lucas Gabriel",
        email: "lucas@gmail.com",
        password: "lucas",
      },
    });

    expect(userUpdated).toBeTruthy();
  });

  test("Debe crear y actualizar el email de un usuario", async () => {
    const user = await UserModel.create({
      username: "Melina",
      email: "melins@gmail.com",
      password: "melina",
    });

    expect(user).toBeTruthy();

    user.email = "melina@gmail.com";

    await user.save();

    const userUpdated = await UserModel.findOne({
      where: {
        username: "Melina",
        email: "melina@gmail.com",
        password: "melina",
      },
    });

    expect(userUpdated).toBeTruthy();
  });

  test("Debe crear y actualizar la contraseña de un usuario", async () => {
    const user = await UserModel.create({
      username: "Wilfredo",
      email: "wilfredo@gmail.com",
      password: "wilfredl",
    });

    expect(user).toBeTruthy();

    user.password = "wilfredo";

    await user.save();

    const userUpdated = await UserModel.findOne({
      where: {
        username: "Wilfredo",
        email: "wilfredo@gmail.com",
        password: "wilfredo",
      },
    });
  });

  test("No debe actualizar el correo de un usuario a uno ya existente", async () => {
    const user = await UserModel.create({
      username: "Carlos",
      email: "carlos@gmail.com",
      password: "carlos",
    });

    expect(user).toBeTruthy();

    const user2 = await UserModel.create({
      username: "Thomas",
      email: "thomas@gmail.com",
      password: "thomas",
    });

    expect(user2).toBeTruthy();

    user2.email = "carlos@gmail.com";

    await expect(user2.save()).rejects.toThrow();
  });
});

describe("Eliminar User", () => {
  test("Debe eliminar un usuario existente", async () => {
    const user = await UserModel.create({
      username: "Javier",
      email: "javier@gmail.com",
      password: "javier",
    });

    expect(user).toBeTruthy();

    await user.destroy();

    const userDeleted = await UserModel.findOne({
      where: {
        username: "Javier",
        email: "javier@gmail.com",
      },
    });

    expect(userDeleted).toBeNull();
  });
});
